var base_tuition = {
    "Under 10,000": 36,
    "10,000 - 14,999": 54,
    "15,000 - 19,999": 72,
    "20,000 - 24,999": 108,
    "25,000 - 29,999": 144,
    "30,000 - 34,999": 198,
    "35,000 - 39,999": 252,
    "40,000 - 44,999": 324,
    "45,000 - 49,999": 396,
    "50,000 - 54,999": 486,
    "55,000 - 59,999": 576,
    "60,000 - 64,999": 684,
    "65,000 - 69,999": 792,
    "70,000 - 74,999": 918,
    "75,000 - 79,999": 1044,
    "80,000 - 84,999": 1188,
    "85,000 - 89,999": 1332,
    "90,000 - 94,999": 1494,
    "95,000 - 99,999": 1656,
    "100,000 - 104,999": 1836,
    "105,000 - 109,999": 2016,
    "110,000 - 114,999": 2214,
    "115,000 - 119,999": 2412,
    "120,000 - 124,999": 2628,
    "125,000 - 129,999": 2844,
    "130,000+": 3022
};

var tuition_adjustments = {
    'five_plus': {
        1: {
            'tuition_cap': 2000,
            'percent_increase': 1.25
        },
        2: {
            'tuition_cap': 3840,
            'percent_increase': 1.20
        },
        3: {
            'tuition_cap': 5520,
            'percent_increase': 1.15
        },
        4: {
            'tuition_cap': 7040,
            'percent_increase': 1.10
        },
        5: {
            'tuition_cap': 8000,
            'percent_increase': 1.00
        }
    },
    'four_year_old': {
        1: {
            'tuition_cap': 1540,
            'percent_increase': 1.4
        },
        2: {
            'tuition_cap': 2869,
            'percent_increase': 1.3
        },
        3: {
            'tuition_cap': 3960,
            'percent_increase': 1.2
        },
        4: {
            'tuition_cap': 4840,
            'percent_increase': 1.1
        },
        5: {
            'tuition_cap': 5500,
            'percent_increase': 1.0
        }
    }
};

var four_year_multiplier = 0.688;

var app = new Vue({
    el: '#app',
    data: {
        base_tuition: base_tuition,
        children: 1,
        days: 5,
        income: '95,000 - 99,999',
        program: 'five-plus',
        tuition_adjustments: tuition_adjustments
    },
    computed: {
        adjustment_key: function() {
            if (this.program === 'four-year'){
                return 'four_year_old';
            } else {
                return 'five_plus';
            }
        },

        calculator: function() {
            var per_day_tuition = this.base_tuition[this.income];
            if (this.program === 'four-year') {
                per_day_tuition = per_day_tuition * four_year_multiplier;
            }

            return new TuitionCalculator(
                this.days,
                per_day_tuition,
                this.tuition_cap,
                this.tuition_multiplier,
                this.children
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
            return Object.keys(this.base_tuition);
        },

        possible_days: function() {
            return [5, 4, 3, 2, 1];
        },

        tuition_adjustment: function() {
            return this.tuition_adjustments[this.adjustment_key][this.days];
        },

        tuition_cap: function() {
            return this.tuition_adjustment['tuition_cap'];
        },

        tuition_multiplier: function() {
            return this.tuition_adjustment['percent_increase'];
        },

        tuition: function() {
            return this.calculator.tuition();
        },

        tuition_assistance: function() {
            return this.full_tuition - this.tuition;
        }
    }
});
