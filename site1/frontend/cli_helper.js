// frontend/cli_helper.js

// ----- LOG A LINE TO TERMINAL -----
export function logTerminal(container, msg, options={}) {
    // options: {dm:false, highlight:false}
    const line = document.createElement("div");
    line.textContent = msg;

    // CRT glow styling
    line.style.color = options.highlight ? "#0ff" : (options.dm ? "#f0f" : "#0f0");
    line.style.fontFamily = "'VT323', monospace";
    line.style.whiteSpace = "pre"; // prevent line-wrap
    line.style.textShadow = "0 0 2px #0f0, 0 0 4px #0f0, 0 0 6px #0f0";

    container.appendChild(line);

    // Flicker effect
    const flicker = () => {
        line.style.opacity = (Math.random() < 0.8) ? 1 : 0.6;
        setTimeout(flicker, Math.random() * 200 + 50);
    };
    flicker();

    // Auto-scroll to bottom
    container.scrollTo({top: container.scrollHeight, behavior: "instant"});
}

// ----- CLEAR TERMINAL -----
export function clearTerminal(container) {
    container.innerHTML = "";
}

// ----- SHOW HELP -----
export function showHelp(container, isDM=false) {
    logTerminal(container, "--- Commands ---", {highlight:true});
    logTerminal(container, "/help - Show this message");
    logTerminal(container, "/roll XdY - Roll dice (e.g., 2d6+1)");
    logTerminal(container, "/attack TARGET EXPR - Attack target with roll expression (1d6+2)");
    logTerminal(container, "/cast_spell SPELL TARGET - Cast a spell on target");
    logTerminal(container, "/list TABLE - List entities in table");
    logTerminal(container, "/create_char BASE64_JSON - Create & save character");
    logTerminal(container, "/next_turn - Advance combat (host only)");
    logTerminal(container, "/tut - Show DM/Player tutorial");

    if(isDM){
        logTerminal(container, "--- DM Commands ---", {dm:true});
        logTerminal(container, "/set_hp NAME VALUE - Set HP of character", {dm:true});
        logTerminal(container, "/damage NAME VALUE - Deal damage", {dm:true});
        logTerminal(container, "/heal NAME VALUE - Heal character", {dm:true});
        logTerminal(container, "/add_cond NAME CONDITION - Add condition", {dm:true});
        logTerminal(container, "/remove_cond NAME CONDITION - Remove condition", {dm:true});
        logTerminal(container, "/next_turn - Advance combat turn (auto every 15s too)", {dm:true});
        logTerminal(container, "/tut - Show DM tutorial", {dm:true});
    }
    logTerminal(container, "Tip: Type commands in the terminal input below.", {highlight:true});
}

// ----- DM /tut BROADCAST -----
export function showTutorial(container, isDM=false, dataChannel=null) {
    if(isDM){
        logTerminal(container, "DM Tutorial: You control combat turns, HP, conditions, and can broadcast messages.", {dm:true});
        if(dataChannel && dataChannel.readyState==="open"){
            dataChannel.send("PLAYER TUTORIAL: Use /roll, /attack, /cast_spell, /list, /create_char to play.");
        }
    } else {
        logTerminal(container, "Player Tutorial: Use /roll, /attack, /cast_spell, /list, /create_char to interact.", {highlight:true});
    }
}
