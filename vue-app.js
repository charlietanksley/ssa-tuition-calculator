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
    'five_day': {
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
    'four_day': {
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

function TuitionCalculator(days, daily_tuition, tuition_cap, multiplier, children) {
    this.days = days;
    this.daily_tuition = daily_tuition;
    this.tuition_cap = tuition_cap;
    this.multiplier = multiplier;
    this.children = children;
}

TuitionCalculator.prototype.tuition = function() {
    // calculate tuition for one kid

    // Cap the tuition if needed.
    var tuition = this.daily_tuition * this.days,
        tuition_cap = this.tuition_cap;

    if (tuition > tuition_cap) {
        tuition = tuition_cap;
    }

    return tuition
}



var app = new Vue({
    el: '#app',
    data: {
        base_tuition: base_tuition,
        children: 1,
        days: 5,
        income: '95,000 - 99,999',
        four_year: false,
        tuition_adjustments: tuition_adjustments
    },
    computed: {
        incomes: function() {
            return Object.keys(this.base_tuition);
        },

        possible_days: function() {
            return [5, 4, 3, 2, 1];
        },

        tuition_adjustment: function() {
            // four year functions as a switch here.
            return this.tuition_adjustments['five_day'][this.days];
        },

        tuition_cap: function() {
            return this.tuition_adjustment['tuition_cap'];
        },

        tuition_multiplier: function() {
            return this.tuition_adjustment['percent_increase'];
        },

        tuition: function() {
            var calculator = new TuitionCalculator(
                this.days,
                this.base_tuition[this.income],
                this.tuition_cap,
                this.tuition_multiplier,
                this.children
            )

            return calculator.tuition();
            // var tuition = this.base_tuition[this.income] * this.days;
            // var tuition_cap = this.tuition_cap;

            // // Cap the tuition if needed.
            // if (tuition > tuition_cap) {
            //     tuition = tuition_cap;
            // }

            // // return tuition * this.children;
            // var n = new TuitionCalculator(1, 1, 1, 1, 1);
            // return n.calculator();
        }
    }
});
