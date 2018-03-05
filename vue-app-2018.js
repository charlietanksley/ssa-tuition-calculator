var income_map = {
    "Under 10,000": 1,
    "10,000 - 14,999": 10,
    "15,000 - 19,999": 15,
    "20,000 - 24,999": 20,
    "25,000 - 29,999": 25,
    "30,000 - 34,999": 30,
    "35,000 - 39,999": 35,
    "40,000 - 44,999": 40,
    "45,000 - 49,999": 45,
    "50,000 - 54,999": 50,
    "55,000 - 59,999": 55,
    "60,000 - 64,999": 60,
    "65,000 - 69,999": 65,
    "70,000 - 74,999": 70,
    "75,000 - 79,999": 75,
    "80,000 - 84,999": 80,
    "85,000 - 89,999": 85,
    "90,000 - 94,999": 90,
    "95,000+": 95
};

var app = new Vue({
    el: '#app',
    data: {
        base_tuition: income_map,
        children: 1,
        days: 5,
        income: '95,000+',
        program: 'five-plus',
        tuition_adjustments: tuition_adjustments
    },
    computed: {
        calculator: function() {
            var income = income_map[this.income];

            return new TuitionCalculator(
                this.days,
                income,
                this.children,
                this.program
            );
        },

        children_display: function() {
            if (this.children === 1) {
                return this.children + " child";
            } else {
                return this.children + " children";
            }
        },

        days_display: function() {
            if (this.days === 1) {
                return this.days + " day";
            } else {
                return this.days + " days";
            }
        },

        full_tuition: function() {
            return this.calculator.full_tuition();
        },

        incomes: function() {
            return Object.keys(income_map);
        },

        possible_days: function() {
            return [5, 4, 3, 2, 1];
        },

        tuition: function() {
            return this.calculator.tuition();
        },

        tuition_assistance: function() {
            return this.full_tuition - this.tuition;
        }
    }
});
