// Load maths problems for maths.html page
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('maths-container');
    const searchInput = document.getElementById('math-search');
    const filterSelect = document.getElementById('math-filter');
    const noResults = document.getElementById('no-maths-found');
    
    let allMaths = [];
    let filteredMaths = [];
    
    // Fetch maths from JSON
    fetch('data/maths.json')
        .then(response => response.json())
        .then(maths => {
            allMaths = maths;
            filteredMaths = [...maths];
            renderMaths();
            
            // Show container, hide loading/empty state
            if (container) container.style.display = 'block';
            if (noResults) noResults.style.display = 'none';
        })
        .catch(error => {
            console.error('Error loading maths:', error);
            if (container) container.innerHTML = '<p class="empty-state">Error loading maths problems. Please try again later.</p>';
        });
    
    // Render maths problems to the page
    function renderMaths() {
        if (!container) return;
        
        container.innerHTML = '';
        
        if (filteredMaths.length === 0) {
            if (noResults) noResults.style.display = 'block';
            return;
        }
        
        if (noResults) noResults.style.display = 'none';
        
        // Create a grid for math cards
        const grid = document.createElement('div');
        grid.className = 'maths-grid';
        
        filteredMaths.forEach(math => {
            const mathCard = document.createElement('article');
            mathCard.className = 'math-card';
            mathCard.innerHTML = `
                <div class="math-header">
                    <span class="math-id">Problem #${math.id}</span>
                    ${math.category ? `<span class="math-category">${math.category}</span>` : ''}
                </div>
                <div class="math-question">${math.question}</div>
                <div class="math-controls">
                    <button class="toggle-answer" onclick="toggleAnswer(this)">Show Answer</button>
                    ${math.difficulty ? `<span class="math-difficulty difficulty-${math.difficulty.toLowerCase()}">${math.difficulty}</span>` : ''}
                </div>
                <div class="math-answer">
                    <div class="answer-section">
                        <h4>Answer:</h4>
                        <p>${math.answer}</p>
                    </div>
                    ${math.explanation ? `
                    <div class="explanation-section">
                        <h4>Explanation:</h4>
                        <p>${math.explanation}</p>
                    </div>
                    ` : ''}
                </div>
            `;
            grid.appendChild(mathCard);
        });
        
        container.appendChild(grid);
    }
    
    // Filter maths based on search and category
    function filterMaths() {
        const searchTerm = searchInput.value.toLowerCase();
        const category = filterSelect.value;
        
        filteredMaths = allMaths.filter(math => {
            const matchesSearch = math.question.toLowerCase().includes(searchTerm) ||
                                 math.answer.toLowerCase().includes(searchTerm) ||
                                 (math.explanation && math.explanation.toLowerCase().includes(searchTerm));
            
            const matchesCategory = category === 'all' || 
                                  (math.category && math.category.toLowerCase() === category);
            
            return matchesSearch && matchesCategory;
        });
        
        renderMaths();
    }
    
    // Event listeners for search and filter
    if (searchInput) {
        searchInput.addEventListener('input', filterMaths);
    }
    
    if (filterSelect) {
        filterSelect.addEventListener('change', filterMaths);
    }
    
    // Add CSS for math cards
    const style = document.createElement('style');
    style.textContent = `
        .maths-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: var(--spacing-lg);
        }
        
        .math-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: var(--spacing-md);
        }
        
        .math-id {
            font-size: 0.9rem;
            color: var(--text-light);
            font-weight: 500;
        }
        
        .math-category {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            background-color: rgba(74, 111, 165, 0.1);
            color: var(--primary-color);
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 500;
        }
        
        .math-controls {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: var(--spacing-md);
        }
        
        .math-difficulty {
            font-size: 0.85rem;
            font-weight: 600;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
        }
        
        .difficulty-easy {
            background-color: rgba(76, 175, 80, 0.1);
            color: #4CAF50;
        }
        
        .difficulty-medium {
            background-color: rgba(255, 152, 0, 0.1);
            color: #FF9800;
        }
        
        .difficulty-hard {
            background-color: rgba(244, 67, 54, 0.1);
            color: #F44336;
        }
        
        .answer-section, .explanation-section {
            margin-bottom: var(--spacing-md);
        }
        
        .answer-section h4, .explanation-section h4 {
            margin-bottom: var(--spacing-xs);
            color: var(--primary-color);
        }
        
        @media (max-width: 768px) {
            .maths-grid {
                grid-template-columns: 1fr;
            }
        }
    `;
    document.head.appendChild(style);
});

// Global function to toggle answer visibility
window.toggleAnswer = function(button) {
    const answer = button.parentElement.nextElementSibling;
    const isVisible = answer.classList.contains('show');
    
    if (isVisible) {
        answer.classList.remove('show');
        button.textContent = 'Show Answer';
    } else {
        answer.classList.add('show');
        button.textContent = 'Hide Answer';
    }
};