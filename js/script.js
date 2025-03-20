// Default data for animations
const animationsData = [];

// Load animations from their respective folders
function loadAnimations() {
    // Helper function to load animations by category
    async function loadAnimationsByCategory(category) {
        try {
            const response = await fetch(`animations/${category}/index.json`);
            if (response.ok) {
                const animations = await response.json();
                animationsData.push(...animations);
            }
        } catch (error) {
            console.error(`Error loading ${category} animations:`, error);
        }
    }
    
    // Load animations from each category
    return Promise.all([
        loadAnimationsByCategory('3d'),
        loadAnimationsByCategory('buttons'),
        loadAnimationsByCategory('hover'),
        loadAnimationsByCategory('loaders'),
        loadAnimationsByCategory('text'),
        loadAnimationsByCategory('hero-backgrounds')
    ]);
}

// Initialize animations after loading
document.addEventListener('DOMContentLoaded', async () => {
    // Load animations first
    await loadAnimations();
    
    // Check if we're on the homepage or library page
    const isHomePage = window.location.pathname.endsWith('index.html') || 
                       window.location.pathname === '/' || 
                       window.location.pathname.endsWith('/');
    const isLibraryPage = window.location.pathname.endsWith('library.html');
    
    if (isHomePage) {
        // Initialize featured animations on homepage
        initFeaturedAnimations();
        // Also initialize category filters on homepage for featured grid
        initCategoryFiltersHomepage();
    } else if (isLibraryPage) {
        // Initialize all animations on library page
        initAnimationsGrid();
        // Setup category filtering for library page
        initCategoryFilters();
    }

    // Setup dark mode toggle
    initDarkMode();

    // Setup search functionality
    initSearch();

    // Setup code editor
    initCodeEditor();
    
    // Initialize hero section animations (only on homepage)
    if (isHomePage) {
        initHeroAnimations();
    }
    
    // Initialize smooth scrolling for anchor links
    initSmoothScroll();
    
    // Add page transition effect
    document.body.classList.add('page-loaded');
});

// Function to initialize category filters on homepage
function initCategoryFiltersHomepage() {
    const categoryButtons = document.querySelectorAll('.category-nav .category-btn');
    const featuredGrid = document.getElementById('featured-grid');
    
    if (!categoryButtons.length || !featuredGrid) return;
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            const category = button.dataset.category;
            
            // Filter featured animations based on category
            filterFeaturedAnimations(category);
        });
    });
}

// Function to filter featured animations by category
function filterFeaturedAnimations(category) {
    const featuredGrid = document.getElementById('featured-grid');
    if (!featuredGrid) return;
    
    // Clear current featured animations
    featuredGrid.innerHTML = '';
    
    // Filter animations based on category
    let filteredAnimations;
    if (category === 'all') {
        // Show default featured animations
        filteredAnimations = [
            animationsData.find(anim => anim.id === 'hover-glow'),
            animationsData.find(anim => anim.id === 'text-scramble'),
            animationsData.find(anim => anim.id === 'particle-explosion')
        ].filter(Boolean);
    } else {
        // Filter animations by the selected category (max 3 items)
        filteredAnimations = animationsData
            .filter(anim => anim.category === category)
            .slice(0, 3);
    }
    
    // If no animations match the filter, show a message
    if (filteredAnimations.length === 0) {
        const message = document.createElement('div');
        message.className = 'no-animations-message';
        message.textContent = 'No animations available in this category.';
        featuredGrid.appendChild(message);
        return;
    }
    
    // Add filtered animations to the grid
    filteredAnimations.forEach(animation => {
        const card = createAnimationCard(animation);
        featuredGrid.appendChild(card);
    });
}

// Function to initialize featured animations on the homepage
function initFeaturedAnimations() {
    const featuredGrid = document.getElementById('featured-grid');
    if (!featuredGrid) return;
    
    // Select a subset of animations to feature (using animations that still exist)
    const featuredAnimations = [
        animationsData.find(anim => anim.id === 'hover-glow'),
        animationsData.find(anim => anim.id === 'text-scramble'),
        animationsData.find(anim => anim.id === 'particle-explosion')
    ].filter(Boolean); // Filter out any undefined values
    
    // If we have no animations to display, add a message
    if (featuredAnimations.length === 0) {
        const message = document.createElement('div');
        message.className = 'no-animations-message';
        message.textContent = 'No animations available. Please check back later.';
        featuredGrid.appendChild(message);
        return;
    }
    
    featuredAnimations.forEach(animation => {
        const card = createAnimationCard(animation);
        featuredGrid.appendChild(card);
    });
}

// Function to initialize hero section animations
function initHeroAnimations() {
    // Simple animation without GSAP
    const shapes = document.querySelectorAll('.animated-shape');
    const heroTitle = document.querySelector('.hero-title');
    const heroDescription = document.querySelector('.hero-description');
    const heroButtons = document.querySelector('.hero-buttons');
    const statItems = document.querySelectorAll('.stat-item');
    
    // Animate hero shapes with CSS animations
    shapes.forEach(shape => {
        // Apply random animation parameters using CSS variables
        const xMove = Math.random() * 40 - 20; // -20 to 20
        const yMove = Math.random() * 40 - 20; // -20 to 20
        const rotation = Math.random() * 20 - 10; // -10 to 10
        const duration = 15 + Math.random() * 10; // 15 to 25 seconds
        
        shape.style.setProperty('--x-move', `${xMove}px`);
        shape.style.setProperty('--y-move', `${yMove}px`);
        shape.style.setProperty('--rotation', `${rotation}deg`);
        shape.style.setProperty('--duration', `${duration}s`);
        shape.classList.add('animate');
    });
    
    // Simple fade-in animations using setTimeout
    if (heroTitle) {
        setTimeout(() => {
            heroTitle.classList.add('fade-in');
        }, 0);
    }
    
    if (heroDescription) {
        setTimeout(() => {
            heroDescription.classList.add('fade-in');
        }, 300);
    }
    
    if (heroButtons) {
        setTimeout(() => {
            heroButtons.classList.add('fade-in');
        }, 600);
    }
    
    statItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('fade-in');
        }, 900 + (index * 200));
    });
}

// Function to initialize smooth scrolling for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Function to initialize the animations grid
function initAnimationsGrid() {
    const animationsGrid = document.getElementById('animations-grid');
    
    animationsData.forEach(animation => {
        const card = createAnimationCard(animation);
        animationsGrid.appendChild(card);
    });
}

// Function to create an animation card
function createAnimationCard(animation) {
    const card = document.createElement('div');
    card.className = 'animation-card';
    card.dataset.category = animation.category;
    
    let tagsHTML = '';
    animation.tags.forEach(tag => {
        tagsHTML += `<span class="tag">${tag}</span>`;
    });
    
    card.innerHTML = `
        <div class="preview-wrapper" id="preview-${animation.id}">
            ${unescapeHtml(animation.html)}
        </div>
        <div class="card-content">
            <h3 class="card-title">${animation.title}</h3>
            <p class="card-description">${animation.description}</p>
            <div class="card-tags">
                ${tagsHTML}
            </div>
            <div class="card-footer">
                <button class="btn view-code" data-id="${animation.id}">
                    <i class="fas fa-code"></i> View Code
                </button>
                <button class="btn favorite-btn" data-id="${animation.id}">
                    <i class="far fa-heart"></i>
                </button>
            </div>
        </div>
    `;
    
    // Apply the CSS to the preview
    const style = document.createElement('style');
    style.textContent = animation.css;
    card.querySelector('.preview-wrapper').appendChild(style);
    
    // Apply the JS to the preview if it exists
    if (animation.js && animation.js.trim() !== '') {
        setTimeout(() => {
            try {
                const previewEl = card.querySelector('.preview-wrapper');
                
                // Add the script element to the DOM
                const script = document.createElement('script');
                script.textContent = animation.js;
                previewEl.appendChild(script);
                
                // Then check if there's an init function that should be called
                if (animation.init && typeof window[animation.init] === 'function') {
                    window[animation.init]();
                } else {
                    // Fallback to the old method for backward compatibility
                    const scriptFunc = new Function(animation.js);
                    scriptFunc.call(previewEl);
                }
            } catch (error) {
                console.error('Error executing animation JS:', error);
            }
        }, 100);
    }
    
    // Add event listener to the view code button
    card.querySelector('.view-code').addEventListener('click', () => {
        openCodeModal(animation);
    });
    
    // Add event listener to the favorite button
    card.querySelector('.favorite-btn').addEventListener('click', (e) => {
        const btn = e.currentTarget;
        const icon = btn.querySelector('i');
        
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            btn.classList.add('active');
            // Save to favorites in local storage
            saveFavorite(animation.id);
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            btn.classList.remove('active');
            // Remove from favorites in local storage
            removeFavorite(animation.id);
        }
    });
    
    return card;
}

// Function to save a favorite animation to local storage
function saveFavorite(animationId) {
    let favorites = JSON.parse(localStorage.getItem('animxFavorites')) || [];
    if (!favorites.includes(animationId)) {
        favorites.push(animationId);
        localStorage.setItem('animxFavorites', JSON.stringify(favorites));
    }
}

// Function to remove a favorite animation from local storage
function removeFavorite(animationId) {
    let favorites = JSON.parse(localStorage.getItem('animxFavorites')) || [];
    favorites = favorites.filter(id => id !== animationId);
    localStorage.setItem('animxFavorites', JSON.stringify(favorites));
}

// Function to initialize dark mode
function initDarkMode() {
    const themeToggle = document.getElementById('theme-toggle');
    
    // Check for saved user preference
    const savedTheme = localStorage.getItem('animxTheme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('animxTheme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('animxTheme', 'dark');
        }
    });
}

// Function to initialize category filters
function initCategoryFilters() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const animationCards = document.querySelectorAll('.animation-card');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            const category = button.dataset.category;
            
            // Show/hide cards based on category
            animationCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Function to initialize search functionality
function initSearch() {
    const searchInput = document.getElementById('search');
    const animationCards = document.querySelectorAll('.animation-card');
    
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        animationCards.forEach(card => {
            const title = card.querySelector('.card-title').textContent.toLowerCase();
            const description = card.querySelector('.card-description').textContent.toLowerCase();
            const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
            
            // Check if card matches search term
            if (
                title.includes(searchTerm) || 
                description.includes(searchTerm) || 
                tags.some(tag => tag.includes(searchTerm))
            ) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// Let's set up our code editor
let editor;
let currentAnimation;
let currentTab = 'html';

// Helper function to unescape HTML strings with double-escaped quotes
function unescapeHtml(html) {
    if (typeof html !== 'string') return '';
    return html.replace(/\\"/g, '"').replace(/\\\\"/g, '\\"');
}

// Helper function to format code for better readability
function formatCode(code, type) {
    if (!code || typeof code !== 'string') return '';
    
    // First unescape the code
    code = unescapeHtml(code);
    
    if (type === 'html') {
        // Format HTML by adding proper indentation
        return formatHTML(code);
    } else if (type === 'css') {
        // Format CSS by adding proper line breaks and indentation
        return formatCSS(code);
    } else if (type === 'js') {
        // Format JS by adding proper line breaks and indentation
        return formatJS(code);
    }
    
    return code;
}

// Format HTML with proper indentation
function formatHTML(html) {
    // Don't try to format if it's already formatted (contains line breaks)
    if (html.includes('\n')) return html;
    
    let formatted = '';
    let indent = 0;
    
    // Process each character
    for (let i = 0; i < html.length; i++) {
        const char = html[i];
        
        if (char === '<' && html[i+1] !== '/') {
            // Add newline and indent for opening tags
            formatted += '\n' + ' '.repeat(indent * 2) + '<';
            indent++;
        } else if (char === '<' && html[i+1] === '/') {
            // Decrease indent for closing tags and add newline
            indent--;
            formatted += '\n' + ' '.repeat(indent * 2) + '<';
        } else {
            formatted += char;
        }
    }
    
    return formatted.trim();
}

// Format CSS with proper line breaks and indentation
function formatCSS(css) {
    // Don't try to format if it's already formatted (contains line breaks)
    if (css.includes('\n')) return css;
    
    // Add line break after each closing brace and semicolon
    css = css.replace(/}/g, '}\n').replace(/;/g, ';\n');
    
    // Add line break and indentation after each opening brace
    let formatted = '';
    let indent = 0;
    
    for (let i = 0; i < css.length; i++) {
        const char = css[i];
        
        if (char === '{') {
            formatted += ' {\n';
            indent++;
            // Add indentation for the next line
            if (css[i+1] !== '\n') {
                formatted += ' '.repeat(indent * 2);
            }
        } else if (char === '}') {
            formatted += '}';
            indent = Math.max(0, indent - 1);
        } else if (char === '\n') {
            formatted += '\n';
            // Add indentation for the next line if not a closing brace
            if (i + 1 < css.length && css[i+1] !== '}') {
                formatted += ' '.repeat(indent * 2);
            }
        } else {
            formatted += char;
        }
    }
    
    return formatted.trim();
}

// Format JavaScript with proper line breaks and indentation
function formatJS(js) {
    // Don't try to format if it's already formatted (contains line breaks)
    if (js.includes('\n')) return js;
    
    // Add line break after each semicolon and closing brace
    js = js.replace(/;/g, ';\n').replace(/}/g, '}\n');
    
    // Add line break and indentation after each opening brace
    let formatted = '';
    let indent = 0;
    
    for (let i = 0; i < js.length; i++) {
        const char = js[i];
        
        if (char === '{') {
            formatted += ' {\n';
            indent++;
            // Add indentation for the next line
            if (js[i+1] !== '\n') {
                formatted += ' '.repeat(indent * 2);
            }
        } else if (char === '}') {
            formatted += '}';
            indent = Math.max(0, indent - 1);
        } else if (char === '\n') {
            formatted += '\n';
            // Add indentation for the next line if not a closing brace
            if (i + 1 < js.length && js[i+1] !== '}') {
                formatted += ' '.repeat(indent * 2);
            }
        } else {
            formatted += char;
        }
    }
    
    return formatted.trim();
}

// Function to initialize the code editor
function initCodeEditor() {
    // Setup event listeners for the modal
    const modal = document.getElementById('code-modal');
    const closeBtn = modal.querySelector('.close-modal');
    
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    // Setup tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            currentTab = button.dataset.tab;
            updateEditor();
        });
    });
    
    // Setup copy code button
    const copyBtn = document.getElementById('copy-code');
    copyBtn.addEventListener('click', () => {
        const code = editor.getValue();
        navigator.clipboard.writeText(code).then(() => {
            // Show a success message
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy Code';
            }, 2000);
        });
    });
    
    // Setup apply changes button
    const applyBtn = document.getElementById('apply-code');
    applyBtn.addEventListener('click', () => {
        // Apply the edited code to the preview
        updatePreview();
    });
    
    // Setup share button
    const shareBtn = document.getElementById('share-btn');
    shareBtn.addEventListener('click', () => {
        // Create a URL with animation ID as a parameter
        const url = `${window.location.origin}${window.location.pathname}?animation=${currentAnimation.id}`;
        
        // Use the Web Share API if available
        if (navigator.share) {
            navigator.share({
                title: 'AnimX - ' + currentAnimation.title,
                text: 'Check out this cool animation: ' + currentAnimation.title,
                url: url
            }).catch(err => {
                console.log('Error sharing:', err);
                copyShareLink(url);
            });
        } else {
            copyShareLink(url);
        }
    });
    
    // Setup export to CodePen button
    const exportBtn = document.getElementById('export-codepen');
    exportBtn.addEventListener('click', () => {
        // Properly format and unescape all code
        const html = unescapeHtml(currentAnimation.html);
        let css = formatCode(currentAnimation.css, 'css');
        let js = formatCode(currentAnimation.js || '', 'js');
        
        // For hero backgrounds, add additional styling for proper CodePen display
        if (currentAnimation.category === 'hero-backgrounds') {
            // Add CSS for proper sizing in CodePen
            css = `/* CodePen-specific styling */
html, body { 
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

/* Original animation CSS */
${css}`;
            
            // Wrap initialization in document ready event
            if (currentAnimation.init && js.includes(currentAnimation.init) && !js.includes(`${currentAnimation.init}()`)) {
                js = js.trim();
                if (!js.endsWith(';')) js += ';';
                js += `\n\n// Initialize the animation when document is ready
document.addEventListener('DOMContentLoaded', function() {
  ${currentAnimation.init}();
});

// Fallback for when document is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(function() {
    ${currentAnimation.init}();
  }, 1);
}`;
            }
            
            // Add window resize event listener for canvas animations
            if (html.includes('<canvas') && !js.includes('window.addEventListener(\'resize\'')) {
                js += `\n\n// Ensure canvas resizes with the window
window.addEventListener('resize', function() {
  // Reinitialize the animation to handle the new size
  ${currentAnimation.init}();
});`;
            }
        } else {
            // For simpler animations, just add the init call if needed
            if (currentAnimation.init && js.includes(currentAnimation.init) && !js.includes(`${currentAnimation.init}()`)) {
                js = js.trim();
                if (!js.endsWith(';')) js += ';';
                js += `\n\n// Initialize the animation\n${currentAnimation.init}();`;
            }
        }
        
        const data = {
            title: currentAnimation.title,
            description: currentAnimation.description,
            html: html,
            css: css,
            js: js,
            css_external: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
        };
        
        // Create a form to submit to CodePen
        const form = document.createElement('form');
        form.action = 'https://codepen.io/pen/define';
        form.method = 'POST';
        form.target = '_blank';
        
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'data';
        input.value = JSON.stringify(data);
        
        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    });
    
    // Check if there's an animation ID in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const animationId = urlParams.get('animation');
    
    if (animationId) {
        const animation = animationsData.find(anim => anim.id === animationId);
        if (animation) {
            setTimeout(() => {
                openCodeModal(animation);
            }, 500);
        }
    }
}

// Function to open the code modal
function openCodeModal(animation) {
    currentAnimation = animation;
    
    const modal = document.getElementById('code-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalPreview = document.getElementById('modal-preview');
    
    // Set the title
    modalTitle.textContent = animation.title;
    
    // Set up the preview with unescaped HTML
    modalPreview.innerHTML = unescapeHtml(animation.html);
    
    // Apply CSS
    const style = document.createElement('style');
    style.textContent = animation.css;
    modalPreview.appendChild(style);
    
    // Apply JS if it exists
    if (animation.js && animation.js.trim() !== '') {
        try {
            // First add the script to the DOM
            const script = document.createElement('script');
            script.textContent = animation.js;
            modalPreview.appendChild(script);
            
            // Then check if there's an init function that should be called
            if (animation.init && typeof window[animation.init] === 'function') {
                window[animation.init]();
            } else {
                // Fallback to the old method for backward compatibility
                const scriptFunc = new Function(animation.js);
                scriptFunc.call(modalPreview);
            }
        } catch (error) {
            console.error('Error executing animation JS:', error);
        }
    }
    
    // Set active tab to HTML by default
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === 'html') {
            btn.classList.add('active');
        }
    });
    
    currentTab = 'html';
    
    // Initialize or update the code editor
    initializeEditor();
    
    // Show the modal
    modal.classList.add('active');
}

// Function to initialize the editor
function initializeEditor() {
    const editorContainer = document.getElementById('code-editor');
    
    // Clear previous editor if it exists
    if (editor) {
        editorContainer.innerHTML = '';
    }
    
    // Determine the appropriate mode
    let mode;
    switch (currentTab) {
        case 'html':
            mode = 'htmlmixed';
            break;
        case 'css':
            mode = 'css';
            break;
        case 'js':
            mode = 'javascript';
            break;
    }
    
    // Get code based on current tab and format it
    let code;
    switch (currentTab) {
        case 'html':
            code = formatCode(currentAnimation.html, 'html');
            break;
        case 'css':
            code = formatCode(currentAnimation.css, 'css');
            break;
        case 'js':
            code = formatCode(currentAnimation.js || '', 'js');
            break;
    }
    
    // Initialize CodeMirror
    editor = CodeMirror(editorContainer, {
        value: code,
        mode: mode,
        theme: document.documentElement.getAttribute('data-theme') === 'dark' ? 'monokai' : 'default',
        lineNumbers: true,
        lineWrapping: true,
        tabSize: 2,
        autoCloseTags: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        matchTags: true,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
    });
    
    // Refresh editor to ensure proper rendering
    setTimeout(() => {
        editor.refresh();
    }, 10);
}

// Function to update the editor when switching tabs
function updateEditor() {
    // Determine the appropriate mode
    let mode;
    switch (currentTab) {
        case 'html':
            mode = 'htmlmixed';
            break;
        case 'css':
            mode = 'css';
            break;
        case 'js':
            mode = 'javascript';
            break;
    }
    
    // Get code based on current tab and format it
    let code;
    switch (currentTab) {
        case 'html':
            code = formatCode(currentAnimation.html, 'html');
            break;
        case 'css':
            code = formatCode(currentAnimation.css, 'css');
            break;
        case 'js':
            code = formatCode(currentAnimation.js || '', 'js');
            break;
    }
    
    // Update editor
    editor.setOption('mode', mode);
    editor.setValue(code);
}

// Function to update the preview with edited code
function updatePreview() {
    const modalPreview = document.getElementById('modal-preview');
    
    // Update current animation object with edited code
    switch (currentTab) {
        case 'html':
            currentAnimation.html = editor.getValue();
            break;
        case 'css':
            currentAnimation.css = editor.getValue();
            break;
        case 'js':
            currentAnimation.js = editor.getValue();
            break;
    }
    
    // Update the preview with unescaped HTML
    modalPreview.innerHTML = unescapeHtml(currentAnimation.html);
    
    // Apply CSS
    const style = document.createElement('style');
    style.textContent = currentAnimation.css;
    modalPreview.appendChild(style);
    
    // Apply JS if it exists
    if (currentAnimation.js && currentAnimation.js.trim() !== '') {
        try {
            // First add the script to the DOM
            const script = document.createElement('script');
            script.textContent = currentAnimation.js;
            modalPreview.appendChild(script);
            
            // Then check if there's an init function that should be called
            if (currentAnimation.init && typeof window[currentAnimation.init] === 'function') {
                window[currentAnimation.init]();
            } else {
                // Fallback to the old method for backward compatibility
                const scriptFunc = new Function(currentAnimation.js);
                scriptFunc.call(modalPreview);
            }
        } catch (error) {
            console.error('Error executing animation JS:', error);
        }
    }
}

// Function to copy the share link to clipboard
function copyShareLink(url) {
    // Copy the URL to clipboard
    navigator.clipboard.writeText(url).then(() => {
        // Show success message
        const shareBtn = document.getElementById('share-btn');
        shareBtn.innerHTML = '<i class="fas fa-check"></i> Link Copied!';
        setTimeout(() => {
            shareBtn.innerHTML = '<i class="fas fa-share-alt"></i> Share';
        }, 2000);
    });
}  
    