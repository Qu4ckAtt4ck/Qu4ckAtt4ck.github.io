// frontend/cli_helper.js

export function logTerminal(container, msg, options = {}) {
    // options: {dm:false, highlight:false}
    const line = document.createElement("div");
    line.textContent = msg;

    // CRT glow styling
    line.style.color = options.highlight ? "#0ff" : (options.dm ? "#f0f" : "#0f0");
    line.style.fontFamily = "'VT323', monospace";
    line.style.textShadow = "0 0 2px #0f0, 0 0 4px #0f0, 0 0 6px #0f0";

    container.appendChild(line);

    // Flicker effect (CRT)
    const flicker = () => {
        line.style.opacity = (Math.random() < 0.8) ? 1 : 0.6;
        setTimeout(flicker, Math.random() * 200 + 50);
    };
    flicker();

    // Scroll to bottom
    container.scrollTo({ top: container.scrollHeight, behavior: "auto" });
}

export function clearTerminal(container) {
    container.innerHTML = "";
}

// --- HELP GENERATOR ---
export function showHelp(container, isDM = false) {
    logTerminal(container, "--- Commands ---", { highlight: true });
    logTerminal(container, "/help - show this message");
    logTerminal(container, "/roll XdY - roll dice (e.g., 2d6+1)");
    logTerminal(container, "/list [table] - list entities in a table");
    logTerminal(container, "/create_char - step-by-step character creation");
    logTerminal(container, "/save_char NAME - Base64 save your character");
    logTerminal(container, "/load_char BASE64 - Load character from Base64");
    logTerminal(container, "/tut - Show tutorial (DM sends player tutorial)");
    if (isDM) {
        logTerminal(container, "/set_hp NAME VAL - set HP");
        logTerminal(container, "/damage NAME VAL - deal damage");
        logTerminal(container, "/heal NAME VAL - heal character");
        logTerminal(container, "/add_cond NAME CONDITION - add condition");
        logTerminal(container, "/remove_cond NAME CONDITION - remove condition");
        logTerminal(container, "/next_turn - advance combat turn");
    }
    logTerminal(container, "Type commands into the terminal input below.");
}

// --- INTERACTIVE CHARACTER CREATION ---
export async function createCharInteractive(term, pyodide, dataChannel) {
    const charData = {};
    const steps = [
        { key: "name", prompt: "Enter character name:" },
        { key: "race", prompt: "Enter character race (ID from SRD/homebrew):" },
        { key: "classes", prompt: "Enter classes as CLASS:LEVEL comma-separated (e.g., Wizard:1,Fighter:2):" },
        { key: "level", prompt: "Enter total level:" },
        { key: "hp", prompt: "Enter HP (or leave blank for auto):" },
        { key: "hit_dice", prompt: "Enter hit dice as comma-separated values (e.g., 1d6,1d8):" },
        { key: "abilities", prompt: "Enter ability scores STR DEX CON INT WIS CHA space-separated:" },
        { key: "conditions", prompt: "Enter initial conditions (comma-separated, optional):" },
        { key: "spell_slots", prompt: "Enter spell slots as JSON (optional):" }
    ];

    for (let step of steps) {
        logTerminal(term, step.prompt, { highlight: true });
        charData[step.key] = await new Promise(resolve => {
            const listener = e => {
                if (e.key !== "Enter") return;
                const val = e.target.value.trim();
                e.target.value = "";
                cmdInput.removeEventListener("keydown", listener);
                resolve(val);
            };
            cmdInput.addEventListener("keydown", listener);
        });
    }

    // Parse classes
    let classes = {};
    charData.classes.split(",").forEach(cl => {
        const [c, l] = cl.split(":");
        if (c && l) classes[c.trim()] = parseInt(l.trim());
    });

    // Parse abilities
    const ab = charData.abilities.split(" ").map(n => parseInt(n.trim()));
    const abilities = { STR: ab[0], DEX: ab[1], CON: ab[2], INT: ab[3], WIS: ab[4], CHA: ab[5] };

    // Parse hit dice
    const hit_dice = charData.hit_dice.split(",").map(s => s.trim());

    // Conditions
    const conditions = charData.conditions ? charData.conditions.split(",").map(c => c.trim()) : [];

    // Spell slots
    let spell_slots = {};
    try { spell_slots = charData.spell_slots ? JSON.parse(charData.spell_slots) : {}; } catch {}

    // Create character in Pyodide
    const cmd = `
create_char_full(
    "${charData.name}",
    "${charData.race}",
    ${JSON.stringify(classes)},
    ${parseInt(charData.level) || 1},
    ${JSON.stringify(abilities)},
    ${charData.hp ? parseInt(charData.hp) : 'None'},
    ${JSON.stringify(hit_dice)},
    ${JSON.stringify(conditions)},
    ${JSON.stringify(spell_slots)},
    {}
)
`;
    try {
        await pyodide.runPythonAsync(cmd);
        logTerminal(term, `Character ${charData.name} created successfully!`, { highlight: true });

        // Auto-save Base64
        const encoded = await pyodide.runPythonAsync(`save_char("${charData.name}")`);
        logTerminal(term, `=== Base64 Character Save ===`, { highlight: true });
        logTerminal(term, encoded, { highlight: true });
        logTerminal(term, `=============================`, { highlight: true });

        // Broadcast creation to other players
        if (dataChannel && dataChannel.readyState === "open") dataChannel.send(`/char_created ${encoded}`);
    } catch (err) {
        logTerminal(term, "Error creating character: " + err);
    }
}
