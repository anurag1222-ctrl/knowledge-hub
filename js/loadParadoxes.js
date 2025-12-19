// Load paradoxes for paradoxes.html page
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('paradoxes-container');
    const searchInput = document.getElementById('paradox-search');
    const filterSelect = document.getElementById('paradox-filter');
    const noResults = document.getElementById('no-paradoxes-found');
    
    let allParadoxes = [];
    let filteredParadoxes = [];
    
    // Fetch paradoxes from JSON
    fetch('data/paradoxes.json')
        .then(response => response.json())
        .then(paradoxes => {
            allParadoxes = paradoxes;
            filteredParadoxes = [...paradoxes];
            renderParadoxes();
            
            // Show container, hide loading/empty state
            if (container) container.style.display = 'block';
            if (noResults) noResults.style.display = 'none';
        })
        .catch(error => {
            console.error('Error loading paradoxes:', error);
            if (container) container.innerHTML = '<p class="empty-state">Error loading paradoxes. Please try again later.</p>';
        });
    
    // Render paradoxes to the page
    function renderParadoxes() {
        if (!container) return;
        
        container.innerHTML = '';
        
        if (filteredParadoxes.length === 0) {
            if (noResults) noResults.style.display = 'block';
            return;
        }
        
        if (noResults) noResults.style.display = 'none';
        
        // Create a grid for paradox cards
        const grid = document.createElement('div');
        grid.className = 'paradoxes-grid';
        
        filteredParadoxes.forEach(paradox => {
            const paradoxCard = document.createElement('article');
            paradoxCard.className = 'paradox-card';
            paradoxCard.innerHTML = `
                <div class="paradox-header">
                    <h3 class="paradox-title">${paradox.title}</h3>
                    <span class="paradox-category">${paradox.category}</span>
                </div>
                <div class="paradox-description">
                    <p>${paradox.description}</p>
                </div>
                ${paradox.explanation ? `
                <div class="paradox-explanation">
                    <button class="toggle-explanation" onclick="toggleExplanation(this)">Show Analysis</button>
                    <div class="explanation-content">
                        <h4>Analysis:</h4>
                        <p>${paradox.explanation}</p>
                    </div>
                </div>
                ` : ''}
                ${paradox.variations ? `
                <div class="paradox-variations">
                    <h4>Related Variations:</h4>
                    <ul>
                        ${paradox.variations.map(variation => `<li>${variation}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
            `;
            grid.appendChild(paradoxCard);
        });
        
        container.appendChild(grid);
    }
    
    // Filter paradoxes based on search and category
    function filterParadoxes() {
        const searchTerm = searchInput.value.toLowerCase();
        const category = filterSelect.value;
        
        filteredParadoxes = allParadoxes.filter(paradox => {
            const matchesSearch = paradox.title.toLowerCase().includes(searchTerm) ||
                                 paradox.description.toLowerCase().includes(searchTerm) ||
                                 (paradox.explanation && paradox.explanation.toLowerCase().includes(searchTerm));
            
            const matchesCategory = category === 'all' || 
                                  paradox.category.toLowerCase() === category;
            
            return matchesSearch && matchesCategory;
        });
        
        renderParadoxes();
    }
    
    // Event listeners for search and filter
    if (searchInput) {
        searchInput.addEventListener('input', filterParadoxes);
    }
    
    if (filterSelect) {
        filterSelect.addEventListener('change', filterParadoxes);
    }
    
    // Add CSS for paradox cards
    const style = document.createElement('style');
    style.textContent = `
        .paradoxes-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: var(--spacing-lg);
        }
        
        .paradox-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: var(--spacing-md);
        }
        
        .paradox-title {
            font-size: 1.3rem;
            margin-bottom: var(--spacing-xs);
            flex: 1;
        }
        
        .paradox-category {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            background-color: rgba(255, 126, 95, 0.1);
            color: var(--accent-color);
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 500;
            margin-left: var(--spacing-sm);
        }
        
        .paradox-description {
            margin-bottom: var(--spacing-md);
            line-height: 1.7;
        }
        
        .paradox-explanation {
            margin-top: var(--spacing-md);
            padding-top: var(--spacing-md);
            border-top: 1px solid var(--border-color);
        }
        
        .explanation-content {
            display: none;
            margin-top: var(--spacing-md);
            padding: var(--spacing-md);
            background-color: rgba(0, 0, 0, 0.03);
            border-radius: var(--radius-md);
        }
        
        .explanation-content.show {
            display: block;
            animation: fadeIn 0.5s ease;
        }
        
        .paradox-variations {
            margin-top: var(--spacing-md);
            padding: var(--spacing-md);
            background-color: rgba(74, 111, 165, 0.05);
            border-radius: var(--radius-md);
        }
        
        .paradox-variations h4 {
            margin-bottom: var(--spacing-sm);
            color: var(--primary-color);
        }
        
        .paradox-variations ul {
            padding-left: var(--spacing-md);
        }
        
        .paradox-variations li {
            margin-bottom: var(--spacing-xs);
        }
        
        .toggle-explanation {
            background-color: transparent;
            color: var(--primary-color);
            border: 1px solid var(--primary-color);
            padding: 0.5rem 1rem;
            border-radius: var(--radius-sm);
            cursor: pointer;
            font-family: var(--font-sans);
            font-weight: 500;
            transition: all var(--transition-fast);
        }
        
        .toggle-explanation:hover {
            background-color: var(--primary-color);
            color: white;
        }
        
        @media (max-width: 768px) {
            .paradoxes-grid {
                grid-template-columns: 1fr;
            }
            
            .paradox-header {
                flex-direction: column;
            }
            
            .paradox-category {
                margin-left: 0;
                margin-top: var(--spacing-xs);
                align-self: flex-start;
            }
        }
    `;
    document.head.appendChild(style);
});

// Global function to toggle explanation
window.toggleExplanation = function(button) {
    const explanation = button.nextElementSibling;
    const isVisible = explanation.classList.contains('show');
    
    if (isVisible) {
        explanation.classList.remove('show');
        button.textContent = 'Show Analysis';
    } else {
        explanation.classList.add('show');
        button.textContent = 'Hide Analysis';
    }
};