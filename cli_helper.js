// frontend/cli_helper.js
export function logTerminal(container, msg, options={}) {
    // options: {dm:false, highlight:false}
    const line = document.createElement("div");
    line.textContent = msg;

    // CRT glow styling
    line.style.color = options.highlight ? "#0ff" : (options.dm ? "#f0f" : "#0f0");
    line.style.fontFamily = "'VT323', monospace";
    line.style.textShadow = "0 0 2px #0f0, 0 0 4px #0f0, 0 0 6px #0f0";

    container.appendChild(line);

    // Flicker effect
    const flicker = () => {
        line.style.opacity = (Math.random() < 0.8) ? 1 : 0.6;
        setTimeout(flicker, Math.random()*200 + 50);
    };
    flicker();

    // Smooth scroll to bottom
    container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth"
    });
}

// Optional helper to clear terminal
export function clearTerminal(container) {
    container.innerHTML = "";
}

// Optional /help generator
export function showHelp(container, isDM=false) {
    logTerminal(container, "--- Commands ---", {highlight:true});
    logTerminal(container, "/help - show this message");
    logTerminal(container, "/roll XdY - roll dice (e.g., 2d6+1)");
    logTerminal(container, "/list [table] - list entities in a table");
    if(isDM) {
        logTerminal(container, "/set_hp NAME VAL - set HP");
        logTerminal(container, "/damage NAME VAL - deal damage");
        logTerminal(container, "/heal NAME VAL - heal character");
        logTerminal(container, "/add_cond NAME CONDITION - add condition");
        logTerminal(container, "/remove_cond NAME CONDITION - remove condition");
    }
    logTerminal(container, "Minute buttons also trigger common actions.");
}