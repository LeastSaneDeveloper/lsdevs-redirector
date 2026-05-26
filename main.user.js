// ==UserScript==
// @name LSDev's Redirector
// @namespace https://github.com/LeastSaneDeveloper
// @author LeastSaneDeveloper
// @version 1.0
// @description  Redirects URLs to a modified (Invidious) redirector launchpad.

// @homepage    https://github.com/LeastSaneDeveloper/lsdevs-redirector
// @homepageURL https://github.com/LeastSaneDeveloper/lsdevs-redirector
// @downloadURL https://raw.githubusercontent.com/LeastSaneDeveloper/lsdevs-redirector/main/main.user.js
// @updateURL   https://raw.githubusercontent.com/LeastSaneDeveloper/lsdevs-redirector/main/main.user.js
// @supportURL  https://github.com/LeastSaneDeveloper/lsdevs-redirector/issues

// @match *://www.youtube.com/*
// @match *://youtube.com/*
// @match *://youtu.be/*

//

// @match *://lsdevsredirector.io/*
// @match *://redirect.invidious.io/*

// @run-at document-start
// @grant GM.getValue
// @grant GM.setValue
// @grant GM_xmlhttpRequest
// ==/UserScript==

(async () => {
    // NOTE: I switched to Zed Editor so the code formatting is a bit weird now

    "use strict";
    // TODO implement settings page when you go to lsdevsredirector.io
    const defaultInstances = await GM.getValue("defaultInstances", null);
    const hostName = window.location.hostname;
    const everythingAfterHostname =
        window.location.pathname +
        window.location.search +
        window.location.hash;
    const cleanURL = hostName + window.location.pathname;
    const queryParams = new URLSearchParams(window.location.search);

    // this replaces the row
    function processRow(node, service) {
        const tBody = document.getElementById("instances-tbody");

        if (service === "youtube") {
            if (node.nodeType === 1 && node.nodeName.toLowerCase() === "tr") {
                let a = node.querySelector("a");
                if (!a) return;
                let newHref = new URL(a.href);
                newHref.searchParams.set("quality", "dash");
                newHref.searchParams.set("quality_dash", "1080");
                newHref.searchParams.set("local", "true");
                a.href = newHref.toString();
            }
        }
    }

    function observeRows(service) {
        const tBody = document.getElementById("instances-tbody");

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach(processRow);
            });
        });

        tBody.querySelectorAll("tr").forEach((node) => {
            processRow(node, service);
        });
        observer.observe(tBody, { childList: true, subtree: false });
    }

    // youtube links

    if (
        hostName !== "dnr.youtube.com" &&
        hostName !== "dnr.www.youtube.com" &&
        hostName !== "dnr.youtu.be"
    ) {
        window.location.replace("https://youtu.be" + everythingAfterHostname);
    } else if (
        hostName === "youtube.com" ||
        hostName === "www.youtube.com" ||
        hostName === "youtu.be"
    ) {
        window.location.replace(
            "https://youtube.redirect.invidious.io" + everythingAfterHostname,
        );
    } else if (
        hostName === "youtube.redirect.invidious.io" ||
        hostName === "yt.redirect.invidious.io"
    ) {
        observeRows("youtube");
    }
})();
