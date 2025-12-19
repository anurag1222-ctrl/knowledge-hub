// Load recent posts for homepage
document.addEventListener('DOMContentLoaded', function() {
    // Load recent stories
    fetch('data/stories.json')
        .then(response => response.json())
        .then(stories => {
            const container = document.getElementById('recent-stories');
            if (!container) return;
            
            // Get 3 most recent stories
            const recentStories = stories.slice(0, 3);
            
            // Clear loading state
            container.innerHTML = '';
            
            // Create clickable cards for each story
            recentStories.forEach(story => {
                const storyCard = document.createElement('a');
                storyCard.className = 'card clickable-card';
                storyCard.href = `story.html?id=${story.id}`;
                storyCard.innerHTML = `
                    <div class="card-content">
                        <h3 class="card-title">${story.title}</h3>
                        <div class="card-meta">
                            <span>${formatDate(story.date)}</span>
                            <span>•</span>
                            <span>${story.category}</span>
                        </div>
                        <p class="card-excerpt">${truncateText(story.excerpt, 120)}</p>
                        <div class="card-footer">
                            <span class="read-more">Read Story →</span>
                        </div>
                    </div>
                `;
                container.appendChild(storyCard);
            });
        })
        .catch(error => {
            console.error('Error loading stories:', error);
            document.getElementById('recent-stories').innerHTML = 
                '<p class="empty-state">Unable to load stories</p>';
        });
    
    // Load recent thoughts
    fetch('data/thoughts.json')
        .then(response => response.json())
        .then(thoughts => {
            const container = document.getElementById('recent-thoughts');
            if (!container) return;
            
            // Get 3 most recent thoughts
            const recentThoughts = thoughts.slice(0, 3);
            
            // Clear loading state
            container.innerHTML = '';
            
            // Create clickable cards for each thought
            recentThoughts.forEach(thought => {
                const thoughtCard = document.createElement('a');
                thoughtCard.className = 'thought-card clickable-card';
                thoughtCard.href = 'thoughts.html';
                thoughtCard.innerHTML = `
                    <div class="thought-date">
                        <i class="far fa-calendar"></i> ${formatDate(thought.date)}
                        ${thought.title ? `<span class="thought-title">${thought.title}</span>` : ''}
                    </div>
                    <div class="thought-text">${truncateText(thought.text, 150)}</div>
                    <div class="thought-footer">
                        <span class="read-more">View All Thoughts →</span>
                    </div>
                `;
                container.appendChild(thoughtCard);
            });
        })
        .catch(error => {
            console.error('Error loading thoughts:', error);
            document.getElementById('recent-thoughts').innerHTML = 
                '<p class="empty-state">Unable to load thoughts</p>';
        });
    
    // Load recent maths problems
    fetch('data/maths.json')
        .then(response => response.json())
        .then(maths => {
            const container = document.getElementById('recent-maths');
            if (!container) return;
            
            // Get 3 most recent maths problems
            const recentMaths = maths.slice(0, 3);
            
            // Clear loading state
            container.innerHTML = '';
            
            // Create clickable cards for each maths problem
            recentMaths.forEach(math => {
                const mathCard = document.createElement('a');
                mathCard.className = 'math-card clickable-card';
                mathCard.href = 'maths.html';
                mathCard.innerHTML = `
                    <div class="math-header">
                        <span class="math-id">Problem #${math.id}</span>
                        ${math.category ? `<span class="math-category">${math.category}</span>` : ''}
                    </div>
                    <div class="math-question">${truncateText(math.question, 100)}</div>
                    <div class="math-footer">
                        <span class="read-more">View Answer →</span>
                    </div>
                `;
                container.appendChild(mathCard);
            });
        })
        .catch(error => {
            console.error('Error loading maths:', error);
            document.getElementById('recent-maths').innerHTML = 
                '<p class="empty-state">Unable to load maths problems</p>';
        });
    
    // Load recent paradoxes
    fetch('data/paradoxes.json')
        .then(response => response.json())
        .then(paradoxes => {
            const container = document.getElementById('recent-paradoxes');
            if (!container) return;
            
            // Get 3 most recent paradoxes
            const recentParadoxes = paradoxes.slice(0, 3);
            
            // Clear loading state
            container.innerHTML = '';
            
            // Create clickable cards for each paradox
            recentParadoxes.forEach(paradox => {
                const paradoxCard = document.createElement('a');
                paradoxCard.className = 'paradox-card clickable-card';
                paradoxCard.href = 'paradoxes.html';
                paradoxCard.innerHTML = `
                    <div class="paradox-category">${paradox.category}</div>
                    <h3 class="card-title">${paradox.title}</h3>
                    <p class="card-excerpt">${truncateText(paradox.description, 120)}</p>
                    <div class="paradox-footer">
                        <span class="read-more">Explore Paradox →</span>
                    </div>
                `;
                container.appendChild(paradoxCard);
            });
        })
        .catch(error => {
            console.error('Error loading paradoxes:', error);
            document.getElementById('recent-paradoxes').innerHTML = 
                '<p class="empty-state">Unable to load paradoxes</p>';
        });
});

// Add CSS for clickable cards
const clickableStyles = document.createElement('style');
clickableStyles.textContent = `
    .clickable-card {
        display: block;
        text-decoration: none;
        color: inherit;
        cursor: pointer;
    }
    
    .clickable-card:hover {
        text-decoration: none;
        color: inherit;
    }
    
    .card-footer, .thought-footer, .math-footer, .paradox-footer {
        margin-top: var(--spacing-sm);
        padding-top: var(--spacing-sm);
        border-top: 1px solid var(--border-color);
        display: flex;
        justify-content: flex-end;
    }
    
    .read-more {
        color: var(--primary-color);
        font-weight: 500;
        font-size: 0.9rem;
    }
    
    .clickable-card:hover .read-more {
        text-decoration: underline;
    }
    
    /* Ensure pointer cursor for all clickable cards */
    a.card, a.thought-card, a.math-card, a.paradox-card,
    .clickable-card, .category-card {
        cursor: pointer;
    }
    
    /* Hover effects for all clickable elements */
    a.card:hover, a.thought-card:hover, a.math-card:hover, a.paradox-card:hover,
    .category-card:hover {
        text-decoration: none;
    }
`;
document.head.appendChild(clickableStyles);