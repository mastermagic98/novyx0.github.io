(function(){
    // Список текстових замін
    const REPLACEMENTS = {
        'Дублированный': 'Дубльований',
        'Ukr': 'Українською',
        'Дубляж': 'Дубльований',
        'Оригинальный': 'Оригінальний',
        'Субтитры': 'Субтитри',
        'Многоголосый': 'Багатоголосий',
        'Неофициальный': 'Неофіційний',
        'Украинский': 'Українською',
        'Профессиональный многоголосый': 'Професійний багатоголосий',
        'Zetvideo': 'UaFlix',
        'Нет истории просмотра': 'Історія перегляду відсутня'
    };

    // Конфігурація стилів
    const STYLES = {
        '.torrent-item__seeds span.high-seeds': {
            color: '#00ff00',
            'font-weight': 'bold'
        },
        '.torrent-item__bitrate span.high-bitrate': {
            color: '#ff0000',
            'font-weight': 'bold'
        },
        '.torrent-item__tracker.utopia': {
            color: '#9b59b6',
            'font-weight': 'bold'
        },
        '.torrent-item__tracker.toloka': {
            color: '#2ecc71',
            'font-weight': 'bold'
        },
        // Нові стилі для обводки залежно від кількості seeds
        '.torrent-item.low-seeds': {
            border: '2px solid #ff0000',
            'border-radius': '8px'
        },
        '.torrent-item.medium-seeds': {
            border: '2px solid #0000ff',
            'border-radius': '8px'
        },
        '.torrent-item.high-seeds': {
            border: '2px solid #ffff00',
            'border-radius': '8px'
        },
        '.torrent-item.very-high-seeds': {
            border: '2px solid #006400',
            'border-radius': '8px'
        },
        '.torrent-item.low-seeds .torrent-item__seeds span': {
            color: '#ff0000',
            'font-weight': 'bold'
        },
        '.torrent-item.medium-seeds .torrent-item__seeds span': {
            color: '#0000ff',
            'font-weight': 'bold'
        },
        '.torrent-item.high-seeds .torrent-item__seeds span': {
            color: '#ffff00',
            'font-weight': 'bold'
        },
        '.torrent-item.very-high-seeds .torrent-item__seeds span': {
            color: '#006400',
            'font-weight': 'bold'
        }
    };

    // Додаємо CSS-стилі
    let style = document.createElement('style');
    style.innerHTML = Object.entries(STYLES).map(([selector, props]) => {
        return `${selector} { ${Object.entries(props).map(([prop, val]) => `${prop}: ${val} !important`).join('; ')} }`;
    }).join('\n');
    document.head.appendChild(style);

    // Функція для заміни текстів у вказаних контейнерах
    function replaceTexts() {
        // Список селекторів, де потрібно шукати тексти для заміни
        const containers = [
            '.online-prestige-watched__body',
            '.online-prestige--full .online-prestige__title',
            '.online-prestige--full .online-prestige__info'
        ];

        containers.forEach(selector => {
            document.querySelectorAll(selector).forEach(container => {
                // Заміняємо текст у всіх вузлах-нащадках
                const walker = document.createTreeWalker(
                    container,
                    NodeFilter.SHOW_TEXT,
                    null,
                    false
                );

                let node;
                while (node = walker.nextNode()) {
                    let text = node.nodeValue;
                    Object.entries(REPLACEMENTS).forEach(([original, replacement]) => {
                        if (text.includes(original)) {
                            text = text.replace(new RegExp(original, 'g'), replacement);
                        }
                    });
                    node.nodeValue = text;
                }
            });
        });
    }

    // Функція для оновлення стилів торентів
    function updateTorrentStyles() {
        // Seeds > 19
        document.querySelectorAll('.torrent-item__seeds span').forEach(span => {
            span.classList.toggle('high-seeds', (parseInt(span.textContent) || 0) > 19);
        });

        // Бітрейт > 50
        document.querySelectorAll('.torrent-item__bitrate span').forEach(span => {
            span.classList.toggle('high-bitrate', (parseFloat(span.textContent) || 0) > 50);
        });

        // Трекери
        document.querySelectorAll('.torrent-item__tracker').forEach(tracker => {
            const text = tracker.textContent.trim();
            tracker.classList.remove('utopia', 'toloka');
            
            if (text.includes('UTOPIA (API)')) tracker.classList.add('utopia');
            else if (text.includes('Toloka')) tracker.classList.add('toloka');
        });

        // Нова логіка для обводки залежно від кількості seeds
        document.querySelectorAll('.torrent-item').forEach(torrentItem => {
            const seedsSpan = torrentItem.querySelector('.torrent-item__seeds span');
            if (!seedsSpan) return;

            const seedsCount = parseInt(seedsSpan.textContent) || 0;
            
            // Видаляємо всі попередні класи
            torrentItem.classList.remove('low-seeds', 'medium-seeds', 'high-seeds', 'very-high-seeds');
            
            // Додаємо відповідний клас залежно від кількості seeds
            if (seedsCount >= 0 && seedsCount <= 10) {
                torrentItem.classList.add('low-seeds');
            } else if (seedsCount >= 11 && seedsCount <= 25) {
                torrentItem.classList.add('medium-seeds');
            } else if (seedsCount >= 26 && seedsCount <= 50) {
                torrentItem.classList.add('high-seeds');
            } else if (seedsCount > 50) {
                torrentItem.classList.add('very-high-seeds');
            }
        });
    }

    // Основна функція оновлення
    function updateAll() {
        replaceTexts();
        updateTorrentStyles();
    }

    // Оптимізований спостерігач
    const observer = new MutationObserver(mutations => {
        if (mutations.some(m => m.addedNodes.length)) {
            updateAll();
        }
    });

    // Ініціалізація
    observer.observe(document.body, { childList: true, subtree: true });
    updateAll();
})();

Lampa.Platform.tv();