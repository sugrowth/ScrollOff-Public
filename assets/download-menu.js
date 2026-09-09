// ScrollOff download menu: pick iOS or Android.
// Shared by every page. Progressive: markup is plain links inside a panel, this adds open/close,
// keyboard support, and flips the panel upward when there is no room below.
(function () {
    'use strict';

    var menus = Array.prototype.slice.call(document.querySelectorAll('.download-menu'));
    if (!menus.length) return;

    var idCounter = 0;

    function parts(menu) {
        return {
            toggle: menu.querySelector('.download-toggle'),
            options: menu.querySelector('.download-options'),
            items: Array.prototype.slice.call(menu.querySelectorAll('.download-option'))
        };
    }

    function setOpen(menu, open) {
        var p = parts(menu);
        if (!p.toggle || !p.options) return;

        menu.classList.toggle('open', open);
        p.toggle.setAttribute('aria-expanded', open ? 'true' : 'false');

        if (open) {
            // Flip upward when the panel would run past the bottom of the viewport.
            if (!menu.classList.contains('drop-up')) {
                var rect = p.options.getBoundingClientRect();
                var toggleRect = p.toggle.getBoundingClientRect();
                var roomAbove = toggleRect.top;
                if (rect.bottom > window.innerHeight && roomAbove > rect.height + 10) {
                    menu.classList.add('drop-up');
                    menu.setAttribute('data-auto-up', '1');
                }
            }
        } else if (menu.hasAttribute('data-auto-up')) {
            menu.classList.remove('drop-up');
            menu.removeAttribute('data-auto-up');
        }
    }

    function closeAll(except) {
        menus.forEach(function (menu) {
            if (menu !== except && menu.classList.contains('open')) setOpen(menu, false);
        });
    }

    menus.forEach(function (menu) {
        var p = parts(menu);
        if (!p.toggle || !p.options) return;

        if (!p.options.id) {
            idCounter += 1;
            p.options.id = 'download-options-' + idCounter;
        }
        p.toggle.setAttribute('aria-controls', p.options.id);
        p.toggle.setAttribute('aria-expanded', 'false');

        p.toggle.addEventListener('click', function () {
            var willOpen = !menu.classList.contains('open');
            closeAll(menu);
            setOpen(menu, willOpen);
        });

        p.items.forEach(function (item) {
            item.addEventListener('click', function () { setOpen(menu, false); });
        });

        menu.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                setOpen(menu, false);
                p.toggle.focus();
            } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                if (!menu.classList.contains('open')) {
                    closeAll(menu);
                    setOpen(menu, true);
                }
                var index = p.items.indexOf(document.activeElement);
                var step = e.key === 'ArrowDown' ? 1 : -1;
                var next = index === -1
                    ? (step === 1 ? 0 : p.items.length - 1)
                    : (index + step + p.items.length) % p.items.length;
                if (p.items[next]) p.items[next].focus();
            }
        });

        menu.addEventListener('focusout', function (e) {
            if (!menu.contains(e.relatedTarget)) setOpen(menu, false);
        });
    });

    document.addEventListener('click', function (e) {
        menus.forEach(function (menu) {
            if (!menu.contains(e.target)) setOpen(menu, false);
        });
    });
})();
