// ==UserScript==
// @name         Fake Robux 
// @match        https://www.roblox.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==
(function() {
    'use strict';
    const NAV_VALUE = "1.3M+";  // edit to any custom amount
    const BALANCE_VALUE = "4,931,675";
    const SALES_VALUE = "6,269,806";
    const PENDING_VALUE = "43,555";
    const TOTAL_INCOME_VALUE = "6,273,638";
    const PURCHASES_VALUE = "1,341,963";
    const TOTAL_SPENT_VALUE = "1,341,963";
    const EXTRA_VALUE = "4,948";
    function nav() {
        const el = document.getElementById("nav-robux-amount");
        if (el && el.textContent !== NAV_VALUE) el.textContent = NAV_VALUE;
    }
    function dropdownWallet() {
        const walletSection = document.querySelector("a.dropdown-wallet-section");
        if (!walletSection) return;

        const balanceSpan = walletSection.querySelector("#nav-robux-balance");
        if (balanceSpan && balanceSpan.textContent !== NAV_VALUE) {
            balanceSpan.textContent = NAV_VALUE;
        }
    }
    function balance() {
        const container = document.querySelector(".icon-robux-16x16")?.parentElement;
        if (!container) return;
        const nodes = container.childNodes;
        const last = nodes[nodes.length - 1];
        if (last && last.nodeType === 3) {
            if (last.textContent.trim() !== BALANCE_VALUE) {
                last.textContent = BALANCE_VALUE;
            }
        }
    }
    function transactions() {
        if (!location.href.includes("/transactions")) return;
        const map = {
            "Sales of Goods": SALES_VALUE,
            "Pending Robux": PENDING_VALUE,
            "Purchases": PURCHASES_VALUE
        };
        document.querySelectorAll("td.summary-transaction-label, td.summary-transaction-pending-text").forEach(label => {
            const row = label.parentElement;
            const value = row?.querySelector(".amount span:last-child");
            const sign = row?.querySelector(".amount span:first-child");
            if (!value) return;
            const t = label.textContent.trim();
            if (map[t]) {
                if (value.textContent !== map[t]) value.textContent = map[t];
                if (t === "Purchases" && sign) sign.textContent = "-";
            }
        });
        const totals = document.querySelectorAll("td.summary-transaction-label.font-bold");
        if (totals[0]) {
            const v = totals[0].parentElement.querySelector(".amount span:last-child");
            if (v && v.textContent !== TOTAL_INCOME_VALUE) v.textContent = TOTAL_INCOME_VALUE;
        }
        if (totals[1]) {
            const v = totals[1].parentElement.querySelector(".amount span:last-child");
            if (v && v.textContent !== TOTAL_SPENT_VALUE) v.textContent = TOTAL_SPENT_VALUE;
        }
    }
    function extra() {
        document.querySelectorAll(".text-label-small").forEach(el => {
            if (el.textContent.trim() === "268") {
                el.textContent = EXTRA_VALUE;
            }
        });
    }
    function locationFix() {
        document.querySelectorAll(".settings-text-span-visible").forEach(el => {
            if (el.textContent === "Trinidad and Tobago") {
                el.textContent = "Canada";
            }
        });
    }
    function purchaseModal() {
        const modal = document.querySelector('[role="dialog"]');
        if (!modal) return;
        modal.querySelectorAll('*').forEach(el => {
            const txt = (el.textContent || "").toLowerCase();
            if (
                txt.includes("you need more robux") ||
                txt.includes("buy robux") ||
                txt.includes("get robux") ||
                txt.includes("your payment method")
            ) {
                el.remove();
            }
            if (/\$\d/.test(txt)) {
                el.remove();
            }
            if (el.className?.toString().includes("arrow-up-right")) {
                el.remove();
            }
        });
        modal.querySelectorAll('*').forEach(el => {
            const txt = el.textContent?.trim();
            if (
                el.className?.toString().includes("robux") ||
                (/^\d{1,3}(,\d{3})*$/.test(txt))
            ) {
                el.textContent = BALANCE_VALUE;
            }
        });
        modal.querySelectorAll('*').forEach(el => {
            if ((el.textContent || "").toLowerCase().includes("need more robux")) {
                el.textContent = "Buy Item";
            }
        });
        modal.querySelectorAll('button').forEach(btn => {
            btn.textContent = "Buy";
        });
        modal.querySelectorAll('.text-robux').forEach(el => {
            el.textContent = BALANCE_VALUE;
        });
        let header = modal.querySelector("#rbx-unified-purchase-heading");
        if (!header) {
            header = document.createElement("div");
            header.id = "rbx-unified-purchase-heading";
            header.style.display = "flex";
            header.style.justifyContent = "space-between";
            header.style.alignItems = "center";
            header.style.paddingRight = "42px";
            header.innerHTML = `
                <span style="font-weight:600;">Buy Item</span>
                <div style="display:flex;align-items:center;">
                    <span class="icon-robux-16x16"></span>
                    <span style="margin-left:4px;">${BALANCE_VALUE}</span>
                </div>
            `;
            modal.prepend(header);
        }
    }
    function hookBuyButton() {
        const btn = document.querySelector('.PurchaseButton');
        if (!btn || btn.dataset.fakeHooked) return;
        btn.dataset.fakeHooked = "true";
        btn.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            openFakeModal();
        });
    }
    function openFakeModal() {
        const old = document.getElementById("fake-robux-overlay");
        if (old) old.remove();
        const itemName =
            document.querySelector('.item-details-name-row h1')?.innerText ||
            document.querySelector('h1')?.innerText ||
            "Item";
        const itemPrice =
            document.querySelector('.text-robux-lg')?.innerText ||
            document.querySelector('.text-robux')?.innerText ||
            "25";
        const itemImage =
            document.querySelector('.item-details-thumbnail-container .thumbnail-2d-container img')?.src ||
            document.querySelector('.item-image-container .thumbnail-2d-container img')?.src ||
            document.querySelector('.product-thumbnail .thumbnail-2d-container img')?.src ||
            document.querySelector('[class*="item-details"] .thumbnail-2d-container img')?.src ||
            "https://tr.rbxcdn.com/180DAY-90b6b5bbaf7d7da4d4fcf92cd3b53679/420/420/Gear/Webp/noFilter";
        const overlay = document.createElement("div");
        overlay.id = "fake-robux-overlay";
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.65);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 999999;
            font-family: system-ui, -apple-system, sans-serif;
        `;
        overlay.innerHTML = `
            <div role="dialog" id="radix-3" aria-labelledby="radix-4" data-state="open" class="relative radius-large bg-surface-100 stroke-muted stroke-standard foundation-web-dialog-content shadow-transient-high relative unified-purchase-dialog-content" data-size="Large" tabindex="-1" style="pointer-events: auto;">
                <div class="absolute foundation-web-dialog-close-container">
                    <button type="button" class="foundation-web-close-affordance flex stroke-none bg-none cursor-pointer relative clip group/interactable focus-visible:outline-focus disabled:outline-none bg-over-media-100 padding-medium radius-circle" aria-label="Close" id="fake-modal-close">
                        <div role="presentation" class="absolute inset-[0] transition-colors group-hover/interactable:bg-[var(--color-state-hover)] group-active/interactable:bg-[var(--color-state-press)] group-disabled/interactable:bg-none"></div>
                        <span role="presentation" class="grow-0 shrink-0 basis-auto icon icon-regular-x size-[var(--icon-size-large)]"></span>
                    </button>
                </div>
                <div class="padding-x-xlarge padding-top-xlarge padding-bottom-xlarge gap-xlarge flex flex-col">
                    <div style="margin-top: 2px;">
                        <div id="rbx-unified-purchase-heading" class="flex flex-row items-center justify-between" style="padding-right: 42px;">
                            <span class="text-heading-medium">Buy Item</span>
                            <div class="flex flex-row items-center">
                                <span class="icon-robux-16x16"></span>
                                <span class="text-robux ml-1 text-body-medium">${BALANCE_VALUE}</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-row items-center gap-large">
                        <div class="relative shrink-0 unified-modal-thumbnail-container" style="max-width: 40vw; max-height: 40vw; width: 150px; height: 150px;">
                            <div class="rounded" style="width: 100%; height: 100%; background-color: rgba(255, 255, 255, 0.06);"></div>
                            <div class="absolute unified-modal-thumbnail" style="inset: 0px; display: flex; align-items: center; justify-content: center;">
                                <div class="marketplace-item-purchase-thumbnail-outer-container">
                                    <div class="marketplace-item-purchase-thumbnail-container">
                                        <div class="thumbnail-holder" style="width: 150px; height: 150px; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                                            <span class="thumbnail-2d-container" style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
                                                <img class="" src="${itemImage}" alt="" title="" style="width: 100%; height: 100%; object-fit: cover; object-position: center;">
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="min-w-0 flex flex-col gap-small">
                            <span class="text-body-large break-words">
                                <span class="font-bold">${itemName}</span>
                            </span>
                            <div class="flex flex-row items-center">
                                <span class="icon-robux-16x16"></span>
                                <span class="text-robux">${itemPrice}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="padding-x-xlarge padding-bottom-xlarge flex flex-col mt-[40px]">
                    <div class="gap-small flex flex-col">
                        <div class="flex flex-row-reverse">
                            <button type="button" data-testid="purchase-confirm-button" class="foundation-web-button relative clip group/interactable focus-visible:outline-focus disabled:outline-none cursor-pointer relative flex items-center justify-center stroke-none padding-y-none select-none radius-medium text-label-large height-1200 padding-x-medium bg-action-emphasis content-action-emphasis fill basis-0" style="text-decoration: none;" id="fake-modal-buy">
                                <div role="presentation" class="absolute inset-[0] transition-colors group-hover/interactable:bg-[var(--color-state-hover)] group-active/interactable:bg-[var(--color-state-press)] group-disabled/interactable:bg-none"></div>
                                <span class="flex items-center min-width-0 gap-small">
                                    <span class="padding-y-xsmall text-truncate-end text-no-wrap">Buy</span>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        const closeBtn = document.getElementById("fake-modal-close");
        if (closeBtn) {
            closeBtn.onclick = () => overlay.remove();
        }
        const buyBtn = document.getElementById("fake-modal-buy");
        if (buyBtn) {
            buyBtn.onclick = () => {
                overlay.remove();
            };
        }
        overlay.onclick = (e) => {
            if (e.target === overlay) overlay.remove();
        };
    }
    function run() {
        nav();
        dropdownWallet();  // Added this line
        balance();
        transactions();
        extra();
        locationFix();
        purchaseModal();
        hookBuyButton();
    }
    let i = 0;
    const loop = setInterval(() => {
        run();
        if (++i > 150) clearInterval(loop);
    }, 20);
    const obs = new MutationObserver(() => {
        requestAnimationFrame(run);
    });
    window.addEventListener("load", () => {
        obs.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    });
})();
