/**
 * generatePlans.js
 *
 * Rule-based "AI" logic for the fitness coach.
 * No external AI API — this is deterministic, explainable math + lookup
 * tables, which is exactly what makes it fast, free, and testable.
 */

// ---------- Calorie & macro calculation ----------

// Mifflin-St Jeor equation — the most widely used BMR formula today
function calculateBMR({ weight, height, age, gender }) {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return gender === "male" ? base + 5 : base - 161;
}

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
};

function calculateTDEE(bmr, activityLevel) {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] ?? 1.2;
  return bmr * multiplier;
}

const GOAL_CALORIE_ADJUSTMENT = {
  fat_loss: -500,
  muscle_gain: 300,
  endurance: 0,
  general_fitness: 0,
};

const GOAL_MACRO_SPLIT = {
  fat_loss: { carbs: 0.35, protein: 0.4, fat: 0.25 },
  muscle_gain: { carbs: 0.4, protein: 0.35, fat: 0.25 },
  endurance: { carbs: 0.55, protein: 0.25, fat: 0.2 },
  general_fitness: { carbs: 0.4, protein: 0.3, fat: 0.3 },
};

function calculateMacros(dailyCalories, goal) {
  const split = GOAL_MACRO_SPLIT[goal] ?? GOAL_MACRO_SPLIT.general_fitness;

  return {
    carbsGrams: Math.round((dailyCalories * split.carbs) / 4),
    proteinGrams: Math.round((dailyCalories * split.protein) / 4),
    fatGrams: Math.round((dailyCalories * split.fat) / 9),
  };
}

function generateDietPlan(user) {
  const bmr = calculateBMR(user);
  const tdee = calculateTDEE(bmr, user.activityLevel);
  const adjustment = GOAL_CALORIE_ADJUSTMENT[user.goal] ?? 0;
  const dailyCalories = Math.round(tdee + adjustment);
  const macros = calculateMacros(dailyCalories, user.goal);

  return {
    dailyCalories,
    macros,
    sampleMeals: buildSampleMeals(dailyCalories, user.dietaryPreference),
  };
}

function buildSampleMeals(dailyCalories, dietaryPreference) {
  const MEAL_ITEMS = {
    balanced: {
      Breakfast: ["Oats with fruit", "Boiled eggs"],
      Lunch: ["Grilled chicken", "Brown rice", "Mixed vegetables"],
      Dinner: ["Fish or paneer", "Quinoa", "Salad"],
      Snack: ["Greek yogurt", "Almonds"],
    },
    vegetarian: {
      Breakfast: ["Vegetable poha", "Sprouts"],
      Lunch: ["Paneer curry", "Brown rice", "Dal"],
      Dinner: ["Chickpea salad", "Roti", "Vegetables"],
      Snack: ["Yogurt", "Nuts"],
    },
    vegan: {
      Breakfast: ["Oats with almond milk", "Chia seeds"],
      Lunch: ["Tofu stir-fry", "Brown rice"],
      Dinner: ["Lentil curry", "Quinoa", "Vegetables"],
      Snack: ["Peanut butter toast", "Fruit"],
    },
    high_protein: {
      Breakfast: ["Egg white omelette", "Whole grain toast"],
      Lunch: ["Grilled chicken breast", "Quinoa", "Broccoli"],
      Dinner: ["Fish", "Sweet potato", "Salad"],
      Snack: ["Protein shake", "Cottage cheese"],
    },
  };

  const items = MEAL_ITEMS[dietaryPreference] ?? MEAL_ITEMS.balanced;
  const splits = { Breakfast: 0.25, Lunch: 0.35, Dinner: 0.3, Snack: 0.1 };

  return Object.entries(splits).map(([meal, pct]) => ({
    meal,
    items: items[meal],
    calories: Math.round(dailyCalories * pct),
  }));
}

// ---------- Workout plan generation ----------

const WORKOUT_TEMPLATES = {
  fat_loss: [
    { focus: "Full Body Circuit", exercises: [
      { name: "Jumping jacks", sets: 3, reps: "45s" },
      { name: "Bodyweight squats", sets: 3, reps: "15" },
      { name: "Mountain climbers", sets: 3, reps: "30s" },
      { name: "Push-ups", sets: 3, reps: "10-12" },
    ]},
    { focus: "Cardio + Core", exercises: [
      { name: "Jump rope", sets: 4, reps: "60s" },
      { name: "Plank", sets: 3, reps: "40s" },
      { name: "Bicycle crunches", sets: 3, reps: "20" },
    ]},
    { focus: "Lower Body Circuit", exercises: [
      { name: "Lunges", sets: 3, reps: "12 each leg" },
      { name: "Glute bridges", sets: 3, reps: "15" },
      { name: "Jump squats", sets: 3, reps: "12" },
    ]},
  ],
  muscle_gain: [
    { focus: "Push (Chest/Shoulders/Triceps)", exercises: [
      { name: "Bench press", sets: 4, reps: "8-10" },
      { name: "Overhead press", sets: 3, reps: "8-10" },
      { name: "Tricep dips", sets: 3, reps: "10-12" },
    ]},
    { focus: "Pull (Back/Biceps)", exercises: [
      { name: "Deadlifts", sets: 4, reps: "6-8" },
      { name: "Pull-ups or lat pulldown", sets: 3, reps: "8-10" },
      { name: "Barbell curls", sets: 3, reps: "10-12" },
    ]},
    { focus: "Legs", exercises: [
      { name: "Barbell squats", sets: 4, reps: "8-10" },
      { name: "Romanian deadlifts", sets: 3, reps: "10" },
      { name: "Calf raises", sets: 3, reps: "15" },
    ]},
  ],
  endurance: [
    { focus: "Steady-State Cardio", exercises: [
      { name: "Running or cycling", sets: 1, reps: "30-40 min" },
    ]},
    { focus: "Interval Training", exercises: [
      { name: "Sprint intervals", sets: 8, reps: "30s on / 90s off" },
    ]},
    { focus: "Cross-Training", exercises: [
      { name: "Swimming or rowing", sets: 1, reps: "25-30 min" },
      { name: "Core circuit", sets: 3, reps: "10 min total" },
    ]},
  ],
  general_fitness: [
    { focus: "Full Body Strength", exercises: [
      { name: "Squats", sets: 3, reps: "12" },
      { name: "Push-ups", sets: 3, reps: "10" },
      { name: "Bent-over rows", sets: 3, reps: "12" },
    ]},
    { focus: "Cardio + Mobility", exercises: [
      { name: "Brisk walk or jog", sets: 1, reps: "25 min" },
      { name: "Dynamic stretching", sets: 1, reps: "10 min" },
    ]},
    { focus: "Active Recovery", exercises: [
      { name: "Yoga or light stretching", sets: 1, reps: "20 min" },
    ]},
  ],
};

function generateWorkoutPlan(user) {
  const template = WORKOUT_TEMPLATES[user.goal] ?? WORKOUT_TEMPLATES.general_fitness;

  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const days = dayNames.map((day, i) => {
    const isRestDay = user.activityLevel === "sedentary" ? i % 2 === 1 : i === 3 || i === 6;

    if (isRestDay) {
      return { day, focus: "Rest & Recovery", exercises: [] };
    }

    const workout = template[i % template.length];
    return { day, focus: workout.focus, exercises: workout.exercises };
  });

  return { basedOnGoal: user.goal, days };
}

module.exports = {
  calculateBMR,
  calculateTDEE,
  generateDietPlan,
  generateWorkoutPlan,
};
