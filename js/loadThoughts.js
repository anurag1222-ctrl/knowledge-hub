// Load thoughts for thoughts.html page
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('thoughts-container');
    const searchInput = document.getElementById('thought-search');
    const filterSelect = document.getElementById('thought-filter');
    const noResults = document.getElementById('no-thoughts-found');
    
    let allThoughts = [];
    let filteredThoughts = [];
    
    // Fetch thoughts from JSON
    fetch('data/thoughts.json')
        .then(response => response.json())
        .then(thoughts => {
            allThoughts = thoughts;
            filteredThoughts = [...thoughts];
            renderThoughts();
            
            // Show container, hide loading/empty state
            if (container) container.style.display = 'block';
            if (noResults) noResults.style.display = 'none';
        })
        .catch(error => {
            console.error('Error loading thoughts:', error);
            if (container) container.innerHTML = '<p class="empty-state">Error loading thoughts. Please try again later.</p>';
        });
    
    // Render thoughts to the page
    function renderThoughts() {
        if (!container) return;
        
        container.innerHTML = '';
        
        if (filteredThoughts.length === 0) {
            if (noResults) noResults.style.display = 'block';
            return;
        }
        
        if (noResults) noResults.style.display = 'none';
        
        // Group thoughts by month
        const thoughtsByMonth = groupThoughtsByMonth(filteredThoughts);
        
        // Render each month
        Object.keys(thoughtsByMonth).sort().reverse().forEach(month => {
            const monthSection = document.createElement('div');
            monthSection.className = 'thought-month-section';
            
            const monthHeader = document.createElement('h3');
            monthHeader.className = 'month-header';
            monthHeader.textContent = formatMonth(month);
            monthSection.appendChild(monthHeader);
            
            thoughtsByMonth[month].forEach(thought => {
                const thoughtCard = document.createElement('article');
                thoughtCard.className = 'thought-card';
                thoughtCard.innerHTML = `
                    <div class="thought-date">
                        <i class="far fa-calendar"></i> ${formatDate(thought.date)}
                        ${thought.title ? `<span class="thought-title">${thought.title}</span>` : ''}
                    </div>
                    <div class="thought-text">${thought.text}</div>
                `;
                monthSection.appendChild(thoughtCard);
            });
            
            container.appendChild(monthSection);
        });
    }
    
    // Group thoughts by month (YYYY-MM format)
    function groupThoughtsByMonth(thoughts) {
        const groups = {};
        
        thoughts.forEach(thought => {
            const month = thought.date.substring(0, 7); // YYYY-MM
            if (!groups[month]) {
                groups[month] = [];
            }
            groups[month].push(thought);
        });
        
        return groups;
    }
    
    // Format month for display
    function formatMonth(monthStr) {
        const [year, month] = monthStr.split('-');
        const date = new Date(year, month - 1, 1);
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    
    // Filter thoughts based on search and month
    function filterThoughts() {
        const searchTerm = searchInput.value.toLowerCase();
        const monthFilter = filterSelect.value;
        
        filteredThoughts = allThoughts.filter(thought => {
            const matchesSearch = thought.text.toLowerCase().includes(searchTerm) ||
                                 (thought.title && thought.title.toLowerCase().includes(searchTerm));
            
            const matchesMonth = monthFilter === 'all' || thought.date.startsWith(monthFilter);
            
            return matchesSearch && matchesMonth;
        });
        
        renderThoughts();
    }
    
    // Populate month filter dynamically
    function populateMonthFilter() {
        if (!filterSelect) return;
        
        // Get unique months from thoughts
        const months = new Set();
        allThoughts.forEach(thought => {
            months.add(thought.date.substring(0, 7));
        });
        
        // Convert to array and sort (newest first)
        const monthArray = Array.from(months).sort().reverse();
        
        // Clear existing options (keep "All Months")
        while (filterSelect.options.length > 1) {
            filterSelect.remove(1);
        }
        
        // Add month options
        monthArray.forEach(month => {
            const option = document.createElement('option');
            option.value = month;
            option.textContent = formatMonth(month);
            filterSelect.appendChild(option);
        });
    }
    
    // Event listeners for search and filter
    if (searchInput) {
        searchInput.addEventListener('input', filterThoughts);
    }
    
    if (filterSelect) {
        filterSelect.addEventListener('change', filterThoughts);
    }
    
    // Add CSS for month sections
    const style = document.createElement('style');
    style.textContent = `
        .thought-month-section {
            margin-bottom: var(--spacing-xl);
        }
        
        .month-header {
            font-size: 1.3rem;
            color: var(--primary-color);
            margin-bottom: var(--spacing-md);
            padding-bottom: var(--spacing-xs);
            border-bottom: 2px solid var(--border-color);
        }
        
        .thought-title {
            font-weight: 600;
            color: var(--text-color);
            margin-left: var(--spacing-sm);
        }
    `;
    document.head.appendChild(style);
});