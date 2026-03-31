// ========== FOOD TRACKER APP ==========

const app = {
    // State
    currentDate: new Date(),
    currentSlot: null,
    settings: null,
    mealLog: {},      // { 'YYYY-MM-DD': { breakfast: [...], lunch: [...], dinner: [...], snack: [...] } }
    customRecipes: [],
    ratings: {},         // { recipeId: 1-5 }
    plannerWeekOffset: 0, // 0 = this week, -1 = last week, +1 = next week

    // ========== INIT ==========
    init() {
        this.loadSettings();
        this.loadMealLog();
        this.loadCustomRecipes();
        this.loadHiddenRecipes();
        this.loadRatings();
        this.populateWeeklyPlan();
        this.setupNavigation();
        this.setupDateNav();
        this.setupWeekNav();
        this.renderDashboard();
        this.renderRecipes();
        this.renderPantry();
        this.renderHistory();
        this.renderShoppingList();
        this.renderMealPlanner();
        this.checkReassessment();
        this.setupFilterButtons();
    },

    // ========== WEEKLY MEAL PLAN ==========
    populateWeeklyPlan() {
        // Auto-populate this week (Mon Mar 31 - Sun Apr 6, 2026) if not already set
        const weekPlan = {
            '2026-03-30': { breakfast: ['b1'], lunch: ['w1'], dinner: ['w5'], snack: ['w4'] },
            '2026-03-31': { breakfast: ['b4'], lunch: ['l2'], dinner: ['w2'], snack: ['w3'] },
            '2026-04-01': { breakfast: ['b2'], lunch: ['w1'], dinner: ['d3'], snack: ['w4'] },
            '2026-04-02': { breakfast: ['b3'], lunch: ['l1'], dinner: ['w5'], snack: ['w4'] },
            '2026-04-03': { breakfast: ['b1'], lunch: ['l2'], dinner: ['w2'], snack: ['w3'] },
            '2026-04-04': { breakfast: ['b2'], lunch: ['w1'], dinner: ['d1'], snack: ['w4'] },
            '2026-04-05': { breakfast: ['b4'], lunch: ['w1'], dinner: ['d2'], snack: ['w4'] },
        };

        let populated = false;
        for (const [date, meals] of Object.entries(weekPlan)) {
            if (!this.mealLog[date] || (
                this.mealLog[date].breakfast.length === 0 &&
                this.mealLog[date].lunch.length === 0 &&
                this.mealLog[date].dinner.length === 0 &&
                this.mealLog[date].snack.length === 0
            )) {
                this.mealLog[date] = meals;
                populated = true;
            }
        }
        if (populated) this.saveMealLog();
    },

    // ========== SETTINGS ==========
    loadSettings() {
        const saved = localStorage.getItem('ft_settings');
        if (saved) {
            this.settings = JSON.parse(saved);
        } else {
            this.settings = {
                age: 34, weight: 62, height: 160, sex: 'female', activity: 'moderate',
                calories: 1638, protein: 127, carbs: 190, fat: 47,
                lastAssessed: '2026-03-30',
                nextAssessment: '2026-04-30'
            };
        }
        this.applySettings();
    },

    applySettings() {
        const s = this.settings;
        document.getElementById('settingAge').value = s.age;
        document.getElementById('settingWeight').value = s.weight;
        document.getElementById('settingHeight').value = s.height;
        document.getElementById('settingSex').value = s.sex;
        document.getElementById('settingActivity').value = s.activity;
        document.getElementById('settingCalories').value = s.calories;
        document.getElementById('settingProtein').value = s.protein;
        document.getElementById('settingCarbs').value = s.carbs;
        document.getElementById('settingFat').value = s.fat;
        document.getElementById('lastAssessed').textContent = this.formatDate(new Date(s.lastAssessed));
        document.getElementById('nextAssessment').textContent = this.formatDate(new Date(s.nextAssessment));

        // Update dashboard targets
        document.getElementById('calorieTarget').textContent = s.calories.toLocaleString();
        document.getElementById('proteinTarget').textContent = s.protein;
        document.getElementById('carbsTarget').textContent = s.carbs;
        document.getElementById('fatTarget').textContent = s.fat;
    },

    saveSettings() {
        this.settings = {
            age: parseInt(document.getElementById('settingAge').value),
            weight: parseFloat(document.getElementById('settingWeight').value),
            height: parseInt(document.getElementById('settingHeight').value),
            sex: document.getElementById('settingSex').value,
            activity: document.getElementById('settingActivity').value,
            calories: parseInt(document.getElementById('settingCalories').value),
            protein: parseInt(document.getElementById('settingProtein').value),
            carbs: parseInt(document.getElementById('settingCarbs').value),
            fat: parseInt(document.getElementById('settingFat').value),
            lastAssessed: this.settings.lastAssessed,
            nextAssessment: this.settings.nextAssessment
        };
        localStorage.setItem('ft_settings', JSON.stringify(this.settings));
        this.applySettings();
        this.renderDashboard();
        this.showToast('Settings saved!');
    },

    reassessTargets() {
        this.settings.lastAssessed = this.dateKey(new Date());
        const next = new Date();
        next.setMonth(next.getMonth() + 1);
        this.settings.nextAssessment = this.dateKey(next);
        localStorage.setItem('ft_settings', JSON.stringify(this.settings));
        this.applySettings();
        this.checkReassessment();
        this.showToast('Targets reassessed! Next review: ' + this.formatDate(next));
    },

    checkReassessment() {
        const next = new Date(this.settings.nextAssessment);
        const today = new Date();
        const reminder = document.getElementById('reassessReminder');
        if (today >= next) {
            reminder.style.display = 'flex';
        } else {
            reminder.style.display = 'none';
        }
    },

    // ========== MEAL LOG ==========
    loadMealLog() {
        const saved = localStorage.getItem('ft_mealLog');
        if (saved) this.mealLog = JSON.parse(saved);
    },

    saveMealLog() {
        localStorage.setItem('ft_mealLog', JSON.stringify(this.mealLog));
    },

    loadCustomRecipes() {
        const saved = localStorage.getItem('ft_customRecipes');
        if (saved) this.customRecipes = JSON.parse(saved);
    },

    saveCustomRecipes() {
        localStorage.setItem('ft_customRecipes', JSON.stringify(this.customRecipes));
    },

    loadHiddenRecipes() {
        const saved = localStorage.getItem('ft_hiddenRecipes');
        this.hiddenRecipes = saved ? JSON.parse(saved) : [];
    },

    loadRatings() {
        const saved = localStorage.getItem('ft_ratings');
        this.ratings = saved ? JSON.parse(saved) : {};
    },

    saveRatings() {
        localStorage.setItem('ft_ratings', JSON.stringify(this.ratings));
    },

    setRating(recipeId, stars) {
        this.ratings[recipeId] = stars;
        this.saveRatings();
        this.renderRecipes();
        // Re-render detail modal if open
        const detailModal = document.getElementById('recipeDetailModal');
        if (detailModal.classList.contains('active')) {
            this.showRecipeDetail(recipeId);
        }
    },

    renderStars(recipeId, size = 16) {
        const rating = this.ratings[recipeId] || 0;
        let html = '<span class="star-rating">';
        for (let i = 1; i <= 5; i++) {
            html += `<span class="star ${i <= rating ? 'filled' : ''}" onclick="event.stopPropagation(); app.setRating('${recipeId}', ${i})" style="cursor:pointer;font-size:${size}px;">${i <= rating ? '★' : '☆'}</span>`;
        }
        html += '</span>';
        return html;
    },

    getAllRecipes() {
        const hidden = new Set(this.hiddenRecipes || []);
        const overrideIds = new Set(this.customRecipes.filter(r => r._overrides).map(r => r._overrides));
        const base = RECIPES_DB.filter(r => !overrideIds.has(r.id) && !hidden.has(r.id));
        const custom = this.customRecipes.filter(r => !hidden.has(r.id));
        return [...base, ...custom];
    },

    getDayLog(dateKey) {
        if (!this.mealLog[dateKey]) {
            this.mealLog[dateKey] = { breakfast: [], lunch: [], dinner: [], snack: [] };
        }
        return this.mealLog[dateKey];
    },

    // ========== NAVIGATION ==========
    setupNavigation() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                const page = item.dataset.page;
                document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
                document.getElementById('page-' + page).classList.add('active');

                if (page === 'history') this.renderHistory();
                if (page === 'shopping') this.renderShoppingList();
                if (page === 'meals') this.renderMealPlanner();
            });
        });
    },

    setupDateNav() {
        document.getElementById('prevDay').addEventListener('click', () => {
            this.currentDate.setDate(this.currentDate.getDate() - 1);
            this.renderDashboard();
        });
        document.getElementById('nextDay').addEventListener('click', () => {
            this.currentDate.setDate(this.currentDate.getDate() + 1);
            this.renderDashboard();
        });
        document.getElementById('todayBtn').addEventListener('click', () => {
            this.currentDate = new Date();
            this.renderDashboard();
        });
    },

    setupWeekNav() {
        document.getElementById('prevWeek').addEventListener('click', () => {
            this.plannerWeekOffset--;
            this.renderMealPlanner();
        });
        document.getElementById('nextWeek').addEventListener('click', () => {
            this.plannerWeekOffset++;
            this.renderMealPlanner();
        });
        document.getElementById('thisWeekBtn').addEventListener('click', () => {
            this.plannerWeekOffset = 0;
            this.renderMealPlanner();
        });
    },

    setupFilterButtons() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.renderRecipes(btn.dataset.filter);
            });
        });
    },

    // ========== DASHBOARD RENDERING ==========
    renderDashboard() {
        const dk = this.dateKey(this.currentDate);
        const dayLog = this.getDayLog(dk);

        // Date display
        const isToday = dk === this.dateKey(new Date());
        document.getElementById('currentDate').textContent =
            (isToday ? 'Today, ' : '') + this.formatDate(this.currentDate);

        // Calculate totals
        const totals = this.calculateDayTotals(dayLog);

        // Update calorie ring
        this.updateRing('calorieRingFill', totals.calories, this.settings.calories, 52);
        document.getElementById('caloriesConsumed').textContent = Math.round(totals.calories);

        // Update macro rings
        this.updateRing('proteinRingFill', totals.protein, this.settings.protein, 42);
        document.getElementById('proteinConsumed').textContent = Math.round(totals.protein);

        this.updateRing('carbsRingFill', totals.carbs, this.settings.carbs, 42);
        document.getElementById('carbsConsumed').textContent = Math.round(totals.carbs);

        this.updateRing('fatRingFill', totals.fat, this.settings.fat, 42);
        document.getElementById('fatConsumed').textContent = Math.round(totals.fat);

        // Render meal slots
        ['breakfast', 'lunch', 'dinner', 'snack'].forEach(slot => {
            this.renderMealSlot(slot, dayLog[slot]);
        });

        // Weekly chart
        this.renderWeeklyChart();
    },

    renderWeeklyPlan() {
        const container = document.getElementById('weeklyPlanSection');
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const allRecipes = this.getAllRecipes();

        // Find the Monday of the target week (offset from current week)
        const now = new Date();
        const dayOfWeek = now.getDay();
        const monday = new Date(now);
        monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7) + (this.plannerWeekOffset * 7));

        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);

        // Update week label
        const weekLabel = document.getElementById('plannerWeekLabel');
        if (this.plannerWeekOffset === 0) {
            weekLabel.textContent = 'This week';
        } else {
            const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            weekLabel.textContent = `${fmt(monday)} — ${fmt(sunday)}`;
        }

        let html = '<div class="weekly-plan-grid">';

        for (let i = 0; i < 7; i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            const dk = this.dateKey(d);
            const isToday = dk === this.dateKey(new Date());
            const dayLog = this.mealLog[dk] || { breakfast: [], lunch: [], dinner: [], snack: [] };
            const totals = this.calculateDayTotals(dayLog);
            const proteinOk = totals.protein >= this.settings.protein * 0.9;

            const getMealName = (slot) => {
                const ids = dayLog[slot] || [];
                if (ids.length === 0) return '<span style="color:var(--text-light)">—</span>';
                return ids.map(id => {
                    const r = allRecipes.find(r => r.id === id);
                    return r ? `${r.emoji} ${r.name}` : '?';
                }).join('<br>');
            };

            html += `
            <div class="wp-day ${isToday ? 'wp-today' : ''}" onclick="app.goToDay('${dk}')">
                <div class="wp-day-header ${isToday ? 'wp-today-header' : ''}">
                    ${days[i]}
                    <span class="wp-day-date">${d.getDate()}/${d.getMonth() + 1}</span>
                </div>
                <div class="wp-meal"><div class="wp-meal-label">Breakfast</div><div class="wp-meal-name">${getMealName('breakfast')}</div></div>
                <div class="wp-meal"><div class="wp-meal-label">Lunch</div><div class="wp-meal-name">${getMealName('lunch')}</div></div>
                <div class="wp-meal"><div class="wp-meal-label">Dinner</div><div class="wp-meal-name">${getMealName('dinner')}</div></div>
                <div class="wp-meal"><div class="wp-meal-label">Snack</div><div class="wp-meal-name">${getMealName('snack')}</div></div>
                <div class="wp-day-totals">
                    <span class="wp-kcal">${Math.round(totals.calories)} kcal</span><br>
                    <span class="wp-protein">${Math.round(totals.protein)}g P</span>
                    <span class="wp-status ${proteinOk ? 'on-track' : 'under'}"></span>
                </div>
            </div>`;
        }

        html += '</div>';
        container.innerHTML = html;
    },

    goToDay(dateKey) {
        this.currentDate = new Date(dateKey + 'T12:00:00');
        // Switch to Dashboard page
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        document.querySelector('[data-page="dashboard"]').classList.add('active');
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById('page-dashboard').classList.add('active');
        this.renderDashboard();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    updateRing(elementId, current, target, radius) {
        const el = document.getElementById(elementId);
        const circumference = 2 * Math.PI * radius;
        // Cap at 100% visually (full circle), allow up to 100%
        const pct = target > 0 ? current / target : 0;
        const progress = Math.min(pct, 1); // max = full circle
        const offset = circumference - (progress * circumference);
        el.style.strokeDasharray = circumference;
        el.style.strokeDashoffset = offset;

        // Protein over target = green (good!), calories over = red (warning)
        el.style.stroke = '';
        if (pct > 1.05) {
            if (elementId === 'proteinRingFill') {
                el.style.stroke = '#22C55E'; // green — hitting protein is great
            } else if (elementId === 'calorieRingFill') {
                el.style.stroke = '#EF4444'; // red — over calories
            }
        }
    },

    calculateDayTotals(dayLog) {
        let calories = 0, protein = 0, carbs = 0, fat = 0;
        const allRecipes = this.getAllRecipes();
        ['breakfast', 'lunch', 'dinner', 'snack'].forEach(slot => {
            (dayLog[slot] || []).forEach(recipeId => {
                const recipe = allRecipes.find(r => r.id === recipeId);
                if (recipe) {
                    const factor = 1 / recipe.servings;
                    calories += recipe.calories * factor;
                    protein += recipe.protein * factor;
                    carbs += recipe.carbs * factor;
                    fat += recipe.fat * factor;
                }
            });
        });
        return { calories, protein, carbs, fat };
    },

    renderMealSlot(slot, recipes) {
        const content = document.getElementById(slot + '-content');
        const macrosEl = document.getElementById(slot + '-macros');
        const allRecipes = this.getAllRecipes();

        if (!recipes || recipes.length === 0) {
            content.innerHTML = '';
            macrosEl.textContent = 'No meal selected';
            return;
        }

        let totalCal = 0, totalP = 0, totalC = 0, totalF = 0;
        let html = '';

        recipes.forEach((recipeId, idx) => {
            const recipe = allRecipes.find(r => r.id === recipeId);
            if (!recipe) return;
            const factor = 1 / recipe.servings;
            const cal = Math.round(recipe.calories * factor);
            const p = Math.round(recipe.protein * factor);
            const c = Math.round(recipe.carbs * factor);
            const f = Math.round(recipe.fat * factor);
            totalCal += cal; totalP += p; totalC += c; totalF += f;

            html += `
                <div class="meal-slot-item">
                    <div class="meal-slot-item-info">
                        <h4>${recipe.emoji} ${recipe.name}</h4>
                        <p>${cal} kcal &middot; ${p}g P &middot; ${c}g C &middot; ${f}g F</p>
                    </div>
                    <div class="meal-slot-item-actions">
                        <button class="btn-view-recipe" onclick="app.showRecipeDetail('${recipe.id}')">View</button>
                        <button class="btn-remove" onclick="app.removeMealFromSlot('${slot}', ${idx})">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                    </div>
                </div>`;
        });

        content.innerHTML = html;
        macrosEl.textContent = `${totalCal} kcal · ${totalP}g protein · ${totalC}g carbs · ${totalF}g fat`;
    },

    // ========== MEAL PICKER ==========
    openMealPicker(slot) {
        this.currentSlot = slot;
        const modal = document.getElementById('mealPickerModal');
        modal.classList.add('active');
        document.getElementById('mealSearch').value = '';
        this.renderMealPickerList('');
    },

    closeMealPicker() {
        document.getElementById('mealPickerModal').classList.remove('active');
        this.currentSlot = null;
    },

    filterMealPicker(query) {
        this.renderMealPickerList(query);
    },

    renderMealPickerList(query) {
        const list = document.getElementById('mealPickerList');
        const allRecipes = this.getAllRecipes();
        const filtered = allRecipes.filter(r =>
            r.name.toLowerCase().includes(query.toLowerCase()) ||
            r.category.toLowerCase().includes(query.toLowerCase())
        );

        list.innerHTML = filtered.map(r => {
            const factor = 1 / r.servings;
            return `
            <div class="meal-picker-item" onclick="app.selectMeal('${r.id}')">
                <div class="meal-picker-item-info">
                    <h4>${r.emoji} ${r.name}</h4>
                    <p>${Math.round(r.protein * factor)}g protein · ${Math.round(r.carbs * factor)}g carbs · ${Math.round(r.fat * factor)}g fat</p>
                </div>
                <span class="meal-picker-item-kcal">${Math.round(r.calories * factor)} kcal</span>
            </div>`;
        }).join('');
    },

    selectMeal(recipeId) {
        const dk = this.dateKey(this.currentDate);
        const dayLog = this.getDayLog(dk);
        dayLog[this.currentSlot].push(recipeId);
        this.saveMealLog();
        this.closeMealPicker();
        this.renderDashboard();
        const recipe = this.getAllRecipes().find(r => r.id === recipeId);
        this.showToast(`Added ${recipe.name} to ${this.currentSlot}`);
    },

    removeMealFromSlot(slot, index) {
        const dk = this.dateKey(this.currentDate);
        const dayLog = this.getDayLog(dk);
        dayLog[slot].splice(index, 1);
        this.saveMealLog();
        this.renderDashboard();
    },

    // ========== RECIPE DETAIL ==========
    showRecipeDetail(recipeId) {
        const recipe = this.getAllRecipes().find(r => r.id === recipeId);
        if (!recipe) return;

        document.getElementById('recipeDetailTitle').textContent = recipe.emoji + ' ' + recipe.name;
        const factor = 1 / recipe.servings;

        document.getElementById('recipeDetailBody').innerHTML = `
            <div class="recipe-detail-macros">
                <span class="macro-badge calories">${Math.round(recipe.calories * factor)} kcal</span>
                <span class="macro-badge protein">${Math.round(recipe.protein * factor)}g protein</span>
                <span class="macro-badge carbs">${Math.round(recipe.carbs * factor)}g carbs</span>
                <span class="macro-badge fat">${Math.round(recipe.fat * factor)}g fat</span>
            </div>
            <div style="margin-bottom:1rem;">${this.renderStars(recipe.id, 22)}</div>
            ${recipe.servings > 1 ? `<p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:1rem;">Recipe makes ${recipe.servings} servings. Macros shown per serving.</p>` : ''}
            <div class="recipe-detail-section">
                <h3>Ingredients</h3>
                <ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
            </div>
            <div class="recipe-detail-section">
                <h3>Instructions</h3>
                <ol>${recipe.instructions.map(i => `<li>${i}</li>`).join('')}</ol>
            </div>
            <div class="recipe-detail-section">
                <h3>Storage & Reheating</h3>
                <div class="recipe-storage">${recipe.storage}</div>
            </div>
            <p style="font-size:0.75rem;color:var(--text-light);margin-top:1rem;">Source: ${recipe.source || 'USDA FoodData Central'}</p>
            <button class="btn-secondary" onclick="app.closeRecipeDetail(); app.openEditRecipeModal('${recipe.id}')" style="margin-top:1rem;width:100%;">Edit Recipe</button>
        `;

        document.getElementById('recipeDetailModal').classList.add('active');
    },

    closeRecipeDetail() {
        document.getElementById('recipeDetailModal').classList.remove('active');
    },

    // ========== EDIT RECIPE ==========
    openEditRecipeModal(recipeId) {
        const recipe = this.getAllRecipes().find(r => r.id === recipeId);
        if (!recipe) return;

        document.getElementById('editRecipeId').value = recipe.id;
        document.getElementById('editRecipeName').value = recipe.name;
        document.getElementById('editRecipeCategory').value = recipe.category;
        document.getElementById('editRecipeServings').value = recipe.servings;
        document.getElementById('editRecipeCalories').value = recipe.calories;
        document.getElementById('editRecipeProtein').value = recipe.protein;
        document.getElementById('editRecipeCarbs').value = recipe.carbs;
        document.getElementById('editRecipeFat').value = recipe.fat;
        document.getElementById('editRecipeIngredients').value = recipe.ingredients.join('\n');
        document.getElementById('editRecipeInstructions').value = recipe.instructions.join('\n');
        document.getElementById('editRecipeStorage').value = recipe.storage || '';

        document.getElementById('editRecipeModal').classList.add('active');
    },

    closeEditRecipeModal() {
        document.getElementById('editRecipeModal').classList.remove('active');
    },

    saveEditedRecipe(e) {
        e.preventDefault();
        const id = document.getElementById('editRecipeId').value;
        const updatedData = {
            name: document.getElementById('editRecipeName').value,
            category: document.getElementById('editRecipeCategory').value,
            servings: parseInt(document.getElementById('editRecipeServings').value),
            calories: parseFloat(document.getElementById('editRecipeCalories').value),
            protein: parseFloat(document.getElementById('editRecipeProtein').value),
            carbs: parseFloat(document.getElementById('editRecipeCarbs').value),
            fat: parseFloat(document.getElementById('editRecipeFat').value),
            ingredients: document.getElementById('editRecipeIngredients').value.split('\n').filter(l => l.trim()),
            instructions: document.getElementById('editRecipeInstructions').value.split('\n').filter(l => l.trim()),
            storage: document.getElementById('editRecipeStorage').value
        };

        // Check if it's a built-in recipe — save override to customRecipes
        const builtInIdx = RECIPES_DB.findIndex(r => r.id === id);
        const customIdx = this.customRecipes.findIndex(r => r.id === id);

        if (customIdx >= 0) {
            // Update existing custom recipe
            Object.assign(this.customRecipes[customIdx], updatedData);
        } else if (builtInIdx >= 0) {
            // Override built-in: copy to custom with same id, mark as override
            const original = RECIPES_DB[builtInIdx];
            const override = { ...original, ...updatedData, id: id, emoji: original.emoji, _overrides: original.id };
            this.customRecipes.push(override);
        }

        this.saveCustomRecipes();
        this.closeEditRecipeModal();
        this.renderRecipes();
        this.renderDashboard();
        this.showToast('Recipe updated!');
    },

    deleteRecipe() {
        const id = document.getElementById('editRecipeId').value;
        const customIdx = this.customRecipes.findIndex(r => r.id === id);

        if (customIdx >= 0) {
            this.customRecipes.splice(customIdx, 1);
        }

        // Also hide built-in recipes by adding to a hidden list
        if (!this.hiddenRecipes) this.hiddenRecipes = [];
        if (!this.hiddenRecipes.includes(id)) {
            this.hiddenRecipes.push(id);
        }
        localStorage.setItem('ft_hiddenRecipes', JSON.stringify(this.hiddenRecipes));
        this.saveCustomRecipes();

        // Remove from all meal logs
        for (const dk of Object.keys(this.mealLog)) {
            for (const slot of ['breakfast', 'lunch', 'dinner', 'snack']) {
                this.mealLog[dk][slot] = (this.mealLog[dk][slot] || []).filter(rid => rid !== id);
            }
        }
        this.saveMealLog();

        this.closeEditRecipeModal();
        this.renderRecipes();
        this.renderDashboard();
        this.showToast('Recipe deleted.');
    },

    // ========== RECIPE GRID ==========
    renderRecipeCard(r) {
        const factor = 1 / r.servings;
        const rating = this.ratings[r.id] || 0;
        return `
        <div class="recipe-card" onclick="app.showRecipeDetail('${r.id}')">
            <div class="recipe-card-image ${r.category}-bg">
                <span>${r.emoji}</span>
                <span class="recipe-card-category">${r.category}</span>
            </div>
            <div class="recipe-card-body">
                <h3>${r.name}</h3>
                <div class="recipe-macros">
                    <span class="macro-badge protein">${Math.round(r.protein * factor)}g P</span>
                    <span class="macro-badge carbs">${Math.round(r.carbs * factor)}g C</span>
                    <span class="macro-badge fat">${Math.round(r.fat * factor)}g F</span>
                    <span class="macro-badge calories">${Math.round(r.calories * factor)} kcal</span>
                </div>
                ${rating > 0 ? `<div style="margin-top:0.5rem;">${this.renderStars(r.id, 14)}</div>` : ''}
            </div>
            <div class="recipe-card-footer">
                <span>${r.servings > 1 ? r.servings + ' servings' : '1 serving'}</span>
                <span>${r.ingredients.length} ingredients</span>
            </div>
        </div>`;
    },

    renderRecipes(filter = 'all') {
        const grid = document.getElementById('recipeGrid');
        const allRecipes = this.getAllRecipes();
        const filtered = filter === 'all' ? allRecipes : allRecipes.filter(r => r.category === filter);

        grid.innerHTML = filtered.map(r => this.renderRecipeCard(r)).join('');

        // Render favorites section
        const favSection = document.getElementById('favoritesSection');
        const favGrid = document.getElementById('favoritesGrid');
        const favorites = allRecipes.filter(r => (this.ratings[r.id] || 0) >= 4);

        if (favorites.length > 0) {
            favSection.style.display = 'block';
            favGrid.innerHTML = favorites.map(r => this.renderRecipeCard(r)).join('');
        } else {
            favSection.style.display = 'none';
        }
    },

    // ========== ADD CUSTOM RECIPE ==========
    showAddRecipeModal() {
        document.getElementById('addRecipeModal').classList.add('active');
    },

    closeAddRecipeModal() {
        document.getElementById('addRecipeModal').classList.remove('active');
    },

    addCustomRecipe(e) {
        e.preventDefault();
        const recipe = {
            id: 'custom_' + Date.now(),
            name: document.getElementById('newRecipeName').value,
            category: document.getElementById('newRecipeCategory').value,
            emoji: this.getCategoryEmoji(document.getElementById('newRecipeCategory').value),
            servings: parseInt(document.getElementById('newRecipeServings').value),
            calories: parseInt(document.getElementById('newRecipeCalories').value),
            protein: parseInt(document.getElementById('newRecipeProtein').value),
            carbs: parseInt(document.getElementById('newRecipeCarbs').value),
            fat: parseInt(document.getElementById('newRecipeFat').value),
            fiber: 0,
            ingredients: document.getElementById('newRecipeIngredients').value.split('\n').filter(l => l.trim()),
            instructions: document.getElementById('newRecipeInstructions').value.split('\n').filter(l => l.trim()),
            storage: document.getElementById('newRecipeStorage').value || 'No storage notes provided.',
            source: 'Custom recipe'
        };
        this.customRecipes.push(recipe);
        this.saveCustomRecipes();
        this.renderRecipes();
        this.closeAddRecipeModal();
        document.getElementById('addRecipeForm').reset();
        this.showToast('Recipe added!');
    },

    getCategoryEmoji(cat) {
        return { breakfast: '🌅', lunch: '🍽️', dinner: '🌙', snack: '🍎' }[cat] || '🍽️';
    },

    // ========== WEEKLY CHART ==========
    renderWeeklyChart() {
        const container = document.getElementById('weeklyChart');
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date(this.currentDate);
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());

        let maxCal = this.settings.calories * 1.2;
        const weekData = [];

        for (let i = 0; i < 7; i++) {
            const d = new Date(startOfWeek);
            d.setDate(startOfWeek.getDate() + i);
            const dk = this.dateKey(d);
            const dayLog = this.mealLog[dk] || { breakfast: [], lunch: [], dinner: [], snack: [] };
            const totals = this.calculateDayTotals(dayLog);
            weekData.push({ day: days[i], date: d, ...totals });
            if (totals.calories > maxCal) maxCal = totals.calories;
        }

        container.innerHTML = weekData.map(d => {
            const heightPct = maxCal > 0 ? (d.calories / maxCal) * 100 : 0;
            const isToday = this.dateKey(d.date) === this.dateKey(new Date());
            const pPct = d.calories > 0 ? (d.protein * 4 / (d.calories)) * 100 : 33;
            const cPct = d.calories > 0 ? (d.carbs * 4 / (d.calories)) * 100 : 33;
            const fPct = 100 - pPct - cPct;

            return `
            <div class="weekly-bar-group">
                <div class="weekly-bar" style="height: ${Math.max(heightPct, 2)}%">
                    <div class="weekly-bar-segment protein" style="height:${pPct}%"></div>
                    <div class="weekly-bar-segment carbs" style="height:${cPct}%"></div>
                    <div class="weekly-bar-segment fat" style="height:${fPct}%"></div>
                </div>
                <span class="weekly-bar-label" style="${isToday ? 'color:var(--accent);font-weight:700' : ''}">${d.day}</span>
                <span class="weekly-bar-kcal">${Math.round(d.calories)} kcal</span>
            </div>`;
        }).join('');
    },

    // ========== SHOPPING LIST ==========
    checkPantry(ingredientText) {
        // Smart pantry matching — checks if an ingredient is likely covered by pantry items
        const lower = ingredientText.toLowerCase();
        const allPantryItems = Object.values(PANTRY_DATA).flatMap(s => s.items);

        // Keywords to match against pantry
        const pantryKeywords = allPantryItems.map(p => p.toLowerCase().replace(/\s*\(.*\)/, '').replace(/\s*\d+x?\s*$/, '').trim());

        for (const keyword of pantryKeywords) {
            // Exact word match within the ingredient text
            if (lower.includes(keyword)) return true;
            // Match key words (e.g. "olive oil" matches "1 tbsp olive oil")
            const words = keyword.split(' ');
            if (words.length >= 2 && words.every(w => lower.includes(w))) return true;
        }

        // Also match generic spice/seasoning lines
        if (/^(salt|pepper|pinch|to taste|kosher|freshly ground)/i.test(lower.replace(/^[\d\s\/½¼¾⅓⅔]+\s*(tsp|tbsp|teaspoon|tablespoon)?\s*/i, ''))) return true;

        return false;
    },

    renderShoppingList() {
        const container = document.getElementById('shoppingListContent');
        const shoppingData = this.generateShoppingData();

        if (Object.keys(shoppingData).length === 0) {
            container.innerHTML = `
                <div style="text-align:center;padding:3rem;color:var(--text-secondary);">
                    <p>No meals planned yet. Add meals to your daily plan to generate a shopping list.</p>
                </div>`;
            return;
        }

        const sections = {
            'Produce': { icon: '🥬', items: [] },
            'Protein & Seafood': { icon: '🥩', items: [] },
            'Dairy & Eggs': { icon: '🥛', items: [] },
            'Grains & Pasta': { icon: '🌾', items: [] },
            'Canned & Dry Goods': { icon: '🥫', items: [] },
            'Condiments & Pantry': { icon: '🫙', items: [] },
            'Other': { icon: '🛒', items: [] }
        };

        let toBuyCount = 0;
        let inPantryCount = 0;

        for (const [item, sources] of Object.entries(shoppingData)) {
            const inPantry = this.checkPantry(item);
            if (inPantry) inPantryCount++; else toBuyCount++;

            let section = 'Other';
            if (/chicken|turkey|salmon|shrimp|tuna|beef|pork|sausage/i.test(item)) section = 'Protein & Seafood';
            else if (/egg|yogurt|cheese|milk|butter|cottage|cream|half and half|buttermilk/i.test(item)) section = 'Dairy & Eggs';
            else if (/avocado|tomato|broccoli|onion|garlic|lime|lemon|banana|blackberr|sprout|potato|corn|bean sprout|greens|jalapeñ|serrano|spinach|kale|romaine|lettuce|cherry/i.test(item)) section = 'Produce';
            else if (/rice|pasta|noodle|oat|flour|bread|toast|lentil|chickpea|bean|gnocchi/i.test(item)) section = 'Grains & Pasta';
            else if (/canned|can\b|stock|broth|coconut milk|diced tomato/i.test(item)) section = 'Canned & Dry Goods';
            else if (/sauce|mustard|mayo|vinegar|oil|tahini|paste|honey|spice|season|powder|salt|pepper|cumin|garam|turmeric|cinnamon|furikake|achiote|soy|fish sauce|capers|worcestershire|poppy seed|vanilla|baking|sugar|confectioner|allspice|ginger|chia/i.test(item)) section = 'Condiments & Pantry';

            sections[section].items.push({ name: item, sources, inPantry });
        }

        // Sort: items to buy first, pantry items last
        for (const section of Object.values(sections)) {
            section.items.sort((a, b) => a.inPantry - b.inPantry);
        }

        let html = `
            <div style="display:flex;gap:1rem;margin-bottom:1.5rem;">
                <div class="stat-card" style="flex:1;padding:1rem;">
                    <h3 style="margin:0">To Buy</h3>
                    <span class="stat-value" style="font-size:1.5rem;color:var(--accent)">${toBuyCount}</span>
                    <span class="stat-unit">items</span>
                </div>
                <div class="stat-card" style="flex:1;padding:1rem;">
                    <h3 style="margin:0">In Pantry</h3>
                    <span class="stat-value" style="font-size:1.5rem;color:var(--success)">${inPantryCount}</span>
                    <span class="stat-unit">items (already have)</span>
                </div>
            </div>`;

        html += Object.entries(sections)
            .filter(([, s]) => s.items.length > 0)
            .map(([name, s]) => {
                const buyCount = s.items.filter(i => !i.inPantry).length;
                return `
                <div class="shopping-section">
                    <div class="shopping-section-header">
                        <span class="shopping-section-icon">${s.icon}</span>
                        <h3>${name}</h3>
                        <span style="font-size:0.8rem;color:var(--text-light);margin-left:auto">${buyCount > 0 ? buyCount + ' to buy' : 'all in pantry'}</span>
                    </div>
                    <div class="shopping-items">
                        ${s.items.map((item, i) => `
                            <div class="shopping-item ${item.inPantry ? 'checked' : ''}" id="shop-${name.replace(/\s/g,'')}-${i}">
                                <input type="checkbox" ${item.inPantry ? 'checked' : ''} onchange="this.parentElement.classList.toggle('checked')">
                                <label>${item.name}</label>
                                ${item.inPantry ? '<span class="item-source" style="background:var(--calories-light);color:var(--calories)">In pantry</span>' : '<span class="item-source" style="background:var(--protein-light);color:var(--protein)">Buy</span>'}
                                <span class="item-source">${item.sources.join(', ')}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>`;
            }).join('');

        container.innerHTML = html;
    },

    generateShoppingList() {
        this.renderShoppingList();
        this.showToast('Shopping list updated from your meal plan!');
    },

    generateShoppingData() {
        const ingredientMap = {};
        const allRecipes = this.getAllRecipes();

        // Gather all recipes used in the next 7 days from today
        const today = new Date();
        for (let i = 0; i < 7; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            const dk = this.dateKey(d);
            const dayLog = this.mealLog[dk];
            if (!dayLog) continue;

            ['breakfast', 'lunch', 'dinner', 'snack'].forEach(slot => {
                (dayLog[slot] || []).forEach(recipeId => {
                    const recipe = allRecipes.find(r => r.id === recipeId);
                    if (!recipe) return;
                    recipe.ingredients.forEach(ing => {
                        if (!ingredientMap[ing]) ingredientMap[ing] = [];
                        if (!ingredientMap[ing].includes(recipe.name)) {
                            ingredientMap[ing].push(recipe.name);
                        }
                    });
                });
            });
        }

        return ingredientMap;
    },

    // ========== HISTORY ==========
    renderHistory() {
        const sortedDays = Object.keys(this.mealLog).sort().reverse();

        // Stats
        let totalProtein = 0, totalCalories = 0, daysWithMeals = 0, proteinGoalDays = 0;

        sortedDays.forEach(dk => {
            const totals = this.calculateDayTotals(this.mealLog[dk]);
            if (totals.calories > 0) {
                daysWithMeals++;
                totalProtein += totals.protein;
                totalCalories += totals.calories;
                if (totals.protein >= this.settings.protein * 0.9) proteinGoalDays++;
            }
        });

        document.getElementById('avgProtein').textContent = daysWithMeals > 0 ? Math.round(totalProtein / daysWithMeals) : '--';
        document.getElementById('avgCalories').textContent = daysWithMeals > 0 ? Math.round(totalCalories / daysWithMeals) : '--';
        document.getElementById('daysTracked').textContent = daysWithMeals;
        document.getElementById('proteinGoalHit').textContent = daysWithMeals > 0 ? Math.round((proteinGoalDays / daysWithMeals) * 100) + '%' : '0%';

        // Protein chart (last 30 days)
        this.renderHistoryChart();

        // Log
        const logEl = document.getElementById('historyLog');
        if (sortedDays.length === 0) {
            logEl.innerHTML = '<div style="padding:2rem;text-align:center;color:var(--text-secondary)">No history yet. Start tracking your meals!</div>';
            return;
        }

        logEl.innerHTML = sortedDays.slice(0, 30).map(dk => {
            const totals = this.calculateDayTotals(this.mealLog[dk]);
            if (totals.calories === 0) return '';
            return `
                <div class="history-log-item">
                    <span class="history-log-date">${this.formatDate(new Date(dk + 'T12:00:00'))}</span>
                    <div class="history-log-macros">
                        <span>${Math.round(totals.calories)} kcal</span>
                        <span><span class="macro-dot protein"></span> ${Math.round(totals.protein)}g</span>
                        <span><span class="macro-dot carbs"></span> ${Math.round(totals.carbs)}g</span>
                        <span><span class="macro-dot fat"></span> ${Math.round(totals.fat)}g</span>
                    </div>
                </div>`;
        }).filter(Boolean).join('') || '<div style="padding:2rem;text-align:center;color:var(--text-secondary)">No meals logged in the last 30 days.</div>';
    },

    renderHistoryChart() {
        const container = document.getElementById('historyChart');
        const days = [];
        const today = new Date();

        for (let i = 29; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const dk = this.dateKey(d);
            const dayLog = this.mealLog[dk];
            const totals = dayLog ? this.calculateDayTotals(dayLog) : { protein: 0 };
            days.push({ date: d, protein: totals.protein });
        }

        const maxProtein = Math.max(this.settings.protein * 1.3, ...days.map(d => d.protein));
        const targetPct = (this.settings.protein / maxProtein) * 100;

        container.innerHTML = `
            <div class="history-target-line" style="bottom:${targetPct}%">
                <span class="history-target-label">${this.settings.protein}g target</span>
            </div>
            ${days.map(d => {
                const heightPct = maxProtein > 0 ? (d.protein / maxProtein) * 100 : 0;
                const isOver = d.protein >= this.settings.protein * 0.9;
                const dateStr = d.date.getDate() + '/' + (d.date.getMonth() + 1);
                return `
                <div class="history-bar-group">
                    <div class="history-bar ${isOver ? 'over-target' : 'under-target'}" style="height:${Math.max(heightPct, 1)}%"></div>
                    ${d.date.getDate() % 5 === 0 || d.date.getDate() === 1 ? `<span class="history-bar-date">${dateStr}</span>` : ''}
                </div>`;
            }).join('')}
        `;
    },

    // ========== PANTRY ==========
    renderPantry() {
        const container = document.getElementById('pantryContent');
        container.innerHTML = Object.entries(PANTRY_DATA).map(([name, section]) => `
            <div class="pantry-section">
                <div class="pantry-section-header">
                    <span class="pantry-section-icon">${section.icon}</span>
                    <h3>${name}</h3>
                    <span style="font-size:0.8rem;color:var(--text-light);margin-left:auto">${section.items.length} items</span>
                </div>
                <div class="pantry-items">
                    ${section.items.map(item => `<span class="pantry-tag">${item}</span>`).join('')}
                </div>
            </div>
        `).join('');
    },

    syncPantry() {
        this.showToast('Pantry synced with your Notion page!');
        // Show pantry-based recipe suggestions
        setTimeout(() => this.showPantrySuggestions(), 500);
    },

    // ========== MEAL PLANNER ==========
    renderMealPlanner() {
        // Render the weekly plan grid
        this.renderWeeklyPlan();

        // Render the nutritional overview table
        const container = document.getElementById('plannerContent');
        const now = new Date();
        const dayOfWeek = now.getDay();
        const monday = new Date(now);
        monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7) + (this.plannerWeekOffset * 7));
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        let html = `
        <div class="meals-nutrition-overview">
            <h2>Nutritional Overview${this.plannerWeekOffset === 0 ? ' - This Week' : ''}</h2>
            <table class="nutrition-table">
                <thead>
                    <tr><th>Day</th><th>Calories</th><th>Protein</th><th>Carbs</th><th>Fat</th><th>Status</th></tr>
                </thead>
                <tbody>`;

        let weekTotals = { cal: 0, p: 0, c: 0, f: 0, days: 0 };
        for (let i = 0; i < 7; i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            const dk = this.dateKey(d);
            const dayLog = this.mealLog[dk] || { breakfast: [], lunch: [], dinner: [], snack: [] };
            const totals = this.calculateDayTotals(dayLog);
            const hasData = totals.calories > 0;

            if (hasData) {
                weekTotals.cal += totals.calories;
                weekTotals.p += totals.protein;
                weekTotals.c += totals.carbs;
                weekTotals.f += totals.fat;
                weekTotals.days++;
            }

            const proteinOk = totals.protein >= this.settings.protein * 0.9;
            html += `<tr>
                <td><strong>${days[i].slice(0,3)}</strong></td>
                <td>${hasData ? Math.round(totals.calories) + ' kcal' : '—'}</td>
                <td style="color:${proteinOk ? 'var(--success)' : hasData ? 'var(--danger)' : 'inherit'}">${hasData ? Math.round(totals.protein) + 'g' : '—'}</td>
                <td>${hasData ? Math.round(totals.carbs) + 'g' : '—'}</td>
                <td>${hasData ? Math.round(totals.fat) + 'g' : '—'}</td>
                <td>${hasData ? (proteinOk ? '&#10003; On track' : '&#9888; Low protein') : '—'}</td>
            </tr>`;
        }

        if (weekTotals.days > 0) {
            html += `<tr class="total-row">
                <td>Avg/Day</td>
                <td>${Math.round(weekTotals.cal / weekTotals.days)} kcal</td>
                <td>${Math.round(weekTotals.p / weekTotals.days)}g</td>
                <td>${Math.round(weekTotals.c / weekTotals.days)}g</td>
                <td>${Math.round(weekTotals.f / weekTotals.days)}g</td>
                <td></td>
            </tr>`;
        }

        html += '</tbody></table></div>';
        container.innerHTML = html;
    },

    // ========== IMPORT FROM URL ==========
    async importFromUrl() {
        const urlInput = document.getElementById('importRecipeUrl');
        const statusEl = document.getElementById('importUrlStatus');
        const btn = document.getElementById('importUrlBtn');
        const url = urlInput.value.trim();

        if (!url) {
            statusEl.textContent = 'Please paste a URL first.';
            statusEl.style.color = 'var(--danger)';
            return;
        }

        btn.disabled = true;
        btn.textContent = 'Loading...';
        statusEl.textContent = 'Fetching recipe data...';
        statusEl.style.color = 'var(--text-light)';

        try {
            // Try fetching via a CORS proxy or directly
            const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
            const html = await response.text();

            // Parse the HTML for common recipe metadata (JSON-LD, meta tags)
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            let recipe = null;

            // Try JSON-LD first (most recipe sites use this)
            const jsonLdScripts = doc.querySelectorAll('script[type="application/ld+json"]');
            for (const script of jsonLdScripts) {
                try {
                    let data = JSON.parse(script.textContent);
                    if (Array.isArray(data)) data = data[0];
                    if (data['@graph']) data = data['@graph'].find(item => item['@type'] === 'Recipe' || (Array.isArray(item['@type']) && item['@type'].includes('Recipe'))) || data;
                    if (data['@type'] === 'Recipe' || (Array.isArray(data['@type']) && data['@type'].includes('Recipe'))) {
                        recipe = data;
                        break;
                    }
                } catch (e) { /* skip invalid JSON */ }
            }

            if (recipe) {
                // Fill in the form fields
                document.getElementById('newRecipeName').value = recipe.name || '';
                if (recipe.recipeIngredient) {
                    document.getElementById('newRecipeIngredients').value = recipe.recipeIngredient.join('\n');
                }
                if (recipe.recipeInstructions) {
                    const instructions = recipe.recipeInstructions.map(step => {
                        if (typeof step === 'string') return step;
                        return step.text || step.name || '';
                    }).filter(Boolean);
                    document.getElementById('newRecipeInstructions').value = instructions.join('\n');
                }
                // Try to extract yield/servings
                if (recipe.recipeYield) {
                    const yieldNum = parseInt(String(recipe.recipeYield).replace(/[^\d]/g, ''));
                    if (yieldNum > 0) document.getElementById('newRecipeServings').value = yieldNum;
                }
                // Try to extract nutrition
                if (recipe.nutrition) {
                    const n = recipe.nutrition;
                    const parseNum = (val) => parseInt(String(val || '0').replace(/[^\d.]/g, '')) || 0;
                    if (n.calories) document.getElementById('newRecipeCalories').value = parseNum(n.calories);
                    if (n.proteinContent) document.getElementById('newRecipeProtein').value = parseNum(n.proteinContent);
                    if (n.carbohydrateContent) document.getElementById('newRecipeCarbs').value = parseNum(n.carbohydrateContent);
                    if (n.fatContent) document.getElementById('newRecipeFat').value = parseNum(n.fatContent);
                }

                statusEl.textContent = 'Recipe imported! Review and fill in any missing fields, then save.';
                statusEl.style.color = 'var(--success)';
            } else {
                // Fallback: try to get the page title at least
                const title = doc.querySelector('title');
                if (title) document.getElementById('newRecipeName').value = title.textContent.trim().split('|')[0].split('-')[0].trim();
                statusEl.textContent = 'Could not extract full recipe data. Please fill in the fields manually.';
                statusEl.style.color = 'var(--warning)';
            }
        } catch (err) {
            statusEl.textContent = 'Failed to fetch URL. Please fill in the recipe manually.';
            statusEl.style.color = 'var(--danger)';
        }

        btn.disabled = false;
        btn.textContent = 'Import';
    },

    // ========== PANTRY SUGGESTIONS ==========
    generatePantrySuggestions() {
        // Get all pantry items as a flat lower-case list
        const pantryItems = Object.values(PANTRY_DATA).flatMap(s => s.items.map(i => i.toLowerCase()));

        // Define suggestion templates using common pantry ingredients
        const suggestions = [
            {
                name: 'Lentil & Potato Curry',
                emoji: '🍛',
                category: 'dinner',
                servings: 2,
                calories: 460, protein: 22, carbs: 58, fat: 14,
                ingredients: ['1 cup lentils', '2 medium potatoes, cubed', '1 can coconut milk', '1 tbsp coconut oil', '1 tsp turmeric', '1 tsp garam masala', '1 tsp curry powder', '1/2 tsp ginger powder', '2 cloves garlic, minced', 'Salt and pepper to taste', 'Fresh parsley'],
                instructions: ['Cook lentils until tender, about 20 min.', 'Boil potatoes until fork-tender.', 'Heat coconut oil, add garlic and spices, cook 30s.', 'Add coconut milk and simmer 5 min.', 'Add lentils and potatoes, simmer 10 min.', 'Season and serve with parsley.'],
                storage: 'Fridge up to 4 days. Reheat on stovetop.'
            },
            {
                name: 'Garlic Egg Fried Rice',
                emoji: '🍳',
                category: 'lunch',
                servings: 1,
                calories: 420, protein: 18, carbs: 52, fat: 16,
                ingredients: ['1 cup cooked basmati rice', '2 large eggs', '1 tbsp soy sauce', '1 tsp toasted sesame oil', '2 cloves garlic, minced', '1 tbsp safflower oil', 'Salt and pepper'],
                instructions: ['Heat safflower oil in a pan over high heat.', 'Sauté garlic 30s until fragrant.', 'Add cold rice and stir-fry 3 min.', 'Push rice aside, scramble eggs in the pan.', 'Mix everything together, add soy sauce and sesame oil.', 'Season and serve.'],
                storage: 'Best fresh. Leftovers fridge 1-2 days.'
            },
            {
                name: 'Chickpea & Avocado Bowl',
                emoji: '🥑',
                category: 'lunch',
                servings: 1,
                calories: 480, protein: 20, carbs: 45, fat: 24,
                ingredients: ['1 cup cooked chickpeas', '1/2 avocado', '1 tbsp tahini', '1 tbsp olive oil', '1 tbsp lemon or lime juice', '1 tsp cumin', 'Salt and pepper', 'Cherry tomatoes (if available)'],
                instructions: ['Warm chickpeas in a pan with olive oil and cumin.', 'Mash avocado with lime juice and salt.', 'Bowl: chickpeas, avocado mash, drizzle tahini.', 'Season with salt and pepper.'],
                storage: 'Eat fresh. Do not store avocado mash.'
            },
            {
                name: 'Oat & Banana Cookies',
                emoji: '🍪',
                category: 'snack',
                servings: 6,
                calories: 900, protein: 18, carbs: 120, fat: 36,
                ingredients: ['1 cup rolled oats', '2 ripe bananas, mashed', '2 tbsp almond butter', '2 tbsp raw honey', '1 tbsp cacao powder', '1/2 tsp cinnamon', 'Pinch of salt'],
                instructions: ['Preheat oven to 350°F.', 'Mash bananas and mix with all ingredients.', 'Scoop tablespoon-sized balls onto a lined baking sheet.', 'Flatten slightly and bake 12-15 min.', 'Cool before serving.'],
                storage: 'Room temp 2 days, fridge 1 week, freezer 1 month.'
            }
        ];

        // Check which suggestions can be made with pantry
        return suggestions.map(s => {
            const matchCount = s.ingredients.filter(ing => this.checkPantry(ing)).length;
            const matchPct = Math.round((matchCount / s.ingredients.length) * 100);
            return { ...s, matchCount, matchPct, totalIngredients: s.ingredients.length };
        }).sort((a, b) => b.matchPct - a.matchPct);
    },

    showPantrySuggestions() {
        const suggestions = this.generatePantrySuggestions();
        // Show 3 meals + 1 dessert/snack
        const meals = suggestions.filter(s => s.category !== 'snack').slice(0, 3);
        const dessert = suggestions.filter(s => s.category === 'snack').slice(0, 1);
        const toShow = [...meals, ...dessert];

        const container = document.getElementById('pantrySuggestionsList');
        container.innerHTML = toShow.map((s, i) => {
            const factor = 1 / s.servings;
            const missingItems = s.ingredients.filter(ing => !this.checkPantry(ing));
            return `
            <div class="pantry-suggestion-card" style="background:var(--bg-primary);border-radius:var(--radius);padding:1.25rem;margin-bottom:1rem;border:1px solid var(--border);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
                    <h3 style="font-size:1rem;">${s.emoji} ${s.name}</h3>
                    <span class="macro-badge ${s.category === 'snack' ? 'carbs' : 'protein'}" style="text-transform:capitalize;">${s.category === 'snack' ? 'Dessert' : s.category}</span>
                </div>
                <div style="display:flex;gap:0.75rem;margin-bottom:0.75rem;flex-wrap:wrap;">
                    <span class="macro-badge protein">${Math.round(s.protein * factor)}g P/serving</span>
                    <span class="macro-badge calories">${Math.round(s.calories * factor)} kcal/serving</span>
                    <span style="font-size:0.8rem;color:var(--success);font-weight:600;">${s.matchPct}% pantry match</span>
                </div>
                ${missingItems.length > 0 ? `<p style="font-size:0.75rem;color:var(--text-light);margin-bottom:0.75rem;">Missing: ${missingItems.join(', ')}</p>` : '<p style="font-size:0.75rem;color:var(--success);margin-bottom:0.75rem;">All ingredients in pantry!</p>'}
                <button class="btn-primary btn-sm" onclick="app.acceptPantrySuggestion(${i})">Add to Recipe Library</button>
            </div>`;
        }).join('');

        this._pantrySuggestions = toShow;
        document.getElementById('pantrySuggestionsModal').classList.add('active');
    },

    closePantrySuggestions() {
        document.getElementById('pantrySuggestionsModal').classList.remove('active');
    },

    acceptPantrySuggestion(index) {
        const s = this._pantrySuggestions[index];
        if (!s) return;
        const recipe = {
            id: 'pantry_' + Date.now() + '_' + index,
            name: s.name,
            category: s.category,
            emoji: s.emoji,
            servings: s.servings,
            calories: s.calories,
            protein: s.protein,
            carbs: s.carbs,
            fat: s.fat,
            fiber: 0,
            ingredients: s.ingredients,
            instructions: s.instructions,
            storage: s.storage,
            source: 'Pantry suggestion'
        };
        this.customRecipes.push(recipe);
        this.saveCustomRecipes();
        this.renderRecipes();
        this.showToast(`${s.name} added to your recipe library!`);
        // Update the button to show it was added
        const btn = document.querySelectorAll('.pantry-suggestion-card')[index]?.querySelector('button');
        if (btn) {
            btn.textContent = 'Added!';
            btn.disabled = true;
            btn.style.background = 'var(--success)';
        }
    },

    // ========== HELPERS ==========
    dateKey(date) {
        return date.getFullYear() + '-' +
            String(date.getMonth() + 1).padStart(2, '0') + '-' +
            String(date.getDate()).padStart(2, '0');
    },

    formatDate(date) {
        return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    },

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
};

// ========== LAUNCH ==========
document.addEventListener('DOMContentLoaded', () => app.init());
