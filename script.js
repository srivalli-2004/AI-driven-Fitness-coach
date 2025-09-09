function showPlan(plan) {
    alert(`You selected ${plan} plan!`);
}

function showDiet(gender) {
    alert(`You selected the diet plan for ${gender}!`);
}

function calculateCalories() {
    const meal = document.getElementById('meal').value;
    const calorieData = {
        "apple": 95,
        "banana": 105,
        "chicken": 165,
        "rice": 200,
        // Add more meals and calories here
    };

    if (calorieData[meal.toLowerCase()]) {
        document.getElementById('calorie-result').innerText = `This meal contains ${calorieData[meal.toLowerCase()]} calories.`;
    } else {
        document.getElementById('calorie-result').innerText = "Meal not found in the database.";
    }
}

function saveProgress() {
    const weight = document.getElementById('weight').value;
    localStorage.setItem('weight', weight);
    document.getElementById('display-weight').innerText = weight;
}

// On page load, show saved progress
window.onload = function() {
    const savedWeight = localStorage.getItem('weight');
    if (savedWeight) {
        document.getElementById('display-weight').




