tuition_adjustments = {
    'five-plus': {
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
    'four-year': {
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

four_year_multiplier = 0.688;

function TuitionCalculator(days, income, children, program) {
    this.sibling_discount = 0.10;
    this.days = days;
    this.income = income;
    this.children = parseInt(children);
    this.program = program;
}


TuitionCalculator.prototype.full_yearly_tuition_single = function() {
    var adjustment,
        tuition_cap,
        tuition,
        percent_increase,
        multiplier,
        siblings,
        sibling_discount;

    // Adjust tuition for program and days
    adjustment = tuition_adjustments[this.program][this.days];
    tuition_cap = adjustment['tuition_cap'];
    percent_increase = adjustment['percent_increase'];
    if (this.program == 'five-plus') {
        multiplier = 1;
    } else {
        multiplier = four_year_multiplier;
    }

    tuition = this.full_price_tuition(percent_increase, tuition_cap) * multiplier;

    // Split into 10 months
    tuition = Math.round(tuition / 10);

    // Adjust for number of children
    siblings = this.children - 1;
    if (siblings > 0) {
        var default_discount = 0.5;
        var income_difference = (this.income - 90) / 100;
        sibling_discount = Math.max(0.5, default_discount + income_difference);

        console.log(this.income, sibling_discount);
        tuition = tuition + (tuition * siblings * sibling_discount);
    }

    return tuition;
}

TuitionCalculator.prototype.full_price_tuition = function(adjustment, tuition_cap) {
    var tuition = this.income ** 1.98 + 180 - this.income
    var adjusted_tuition = tuition * adjustment * (this.days / 5)
    if (adjusted_tuition > tuition_cap) {
        adjusted_tuition = tuition_cap;
    }

    return adjusted_tuition;
}

TuitionCalculator.prototype.full_tuition = function() {
    var adjustment,
        tuition_cap,
        percent_increase,
        multiplier;

    // Adjust tuition for program and days
    adjustment = tuition_adjustments[this.program][this.days];
    tuition_cap = adjustment['tuition_cap'];
    percent_increase = adjustment['percent_increase'];

    if (this.program == 'five-plus') {
        multiplier = 1;
    } else {
        multiplier = four_year_multiplier;
    }

    var adjusted_tuition = 8000 * multiplier * percent_increase * (this.days / 5);

    return Math.round((adjusted_tuition * this.children) / 10);
}




TuitionCalculator.prototype.calculate = function() {
    return R.pipe(this.calculate_family_tuition.bind(this),
                  this.cap_tuition.bind(this),
                  this.convert_tuition_to_monthly.bind(this));
}

TuitionCalculator.prototype.calculate_family_tuition = function() {
    var siblings = this.children - 1,
        first_child = this.first_child_tuition(),
        // Okay wow. So there is a bug here wherein the siblings are
        // paying 1/2 of the base tuition (which can go over 8K per
        // year). Or something. Somethign is still wrong here.
        sibling_tuition = this.sibling_tuition() * siblings;

    return first_child + sibling_tuition;
}

TuitionCalculator.prototype.capped_per_child_tuition = function() {
    var tuition = this.per_child_tuition(),
        tuition_cap = this.tuition_cap;

    if (tuition > tuition_cap) {
        return tuition_cap;
    } else {
        return tuition;
    }
}

TuitionCalculator.prototype.cap_tuition = function(family_tuition) {
    var family_tuition_cap = this.family_tuition_cap();

    if (family_tuition > family_tuition_cap) {
        return family_tuition_cap;
    } else {
        return family_tuition;
    }
}

TuitionCalculator.prototype.convert_tuition_to_monthly = function(family_tuition) {
    return (family_tuition / 10).toFixed();
}

TuitionCalculator.prototype.family_tuition_cap = function() {
    return this.tuition_cap * this.children;
}

TuitionCalculator.prototype.first_child_tuition = function() {
    return this.capped_per_child_tuition();
}


TuitionCalculator.prototype.per_child_tuition = function() {
    return this.daily_tuition * this.days * this.multiplier;
}

TuitionCalculator.prototype.sibling_tuition = function() {
    return this.per_child_tuition() / 2;
}

TuitionCalculator.prototype.scale_for_part_time = function(family_tuition) {
    return family_tuition * this.multiplier;
}

TuitionCalculator.prototype.subtract_family_discount = function(family_tuition) {
    var discount,
        siblings = this.children - 1,
        family_tuition_cap = this.family_tuition_cap();

    // If there is only one child OR the family is already getting
    // tuition assistance, don't add in a sibling discount.
    //
    // So this is also a bug: we give the sibling discount *even if*
    // they are getting tuition assistance.  Maybe that is good, but
    // that isn't how I understood it before I started this rewrite.
    //
    if (siblings === 0) {// || family_tuition !== family_tuition_cap) {
        return family_tuition;
    }

    discount = this.per_child_tuition() * this.sibling_discount * siblings;
    return family_tuition - discount;
}

TuitionCalculator.prototype.tuition = function() {
    // return this.calculate()();
    return this.full_yearly_tuition_single()
}
