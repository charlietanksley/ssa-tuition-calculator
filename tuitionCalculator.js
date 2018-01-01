function TuitionCalculator(days, daily_tuition, tuition_cap, multiplier, children) {
    this.sibling_discount = 0.10;
    this.days = days;
    this.daily_tuition = daily_tuition;
    this.tuition_cap = tuition_cap;
    this.multiplier = multiplier;
    this.children = children;
    this.four_year_multiplier = 0.688;
}

TuitionCalculator.prototype.per_child_tuition = function() {
    return this.daily_tuition * this.days * this.multiplier;
}

TuitionCalculator.prototype.family_tuition_cap = function() {
    return this.tuition_cap * this.children;
}

TuitionCalculator.prototype.cap_tuition = function(family_tuition) {
    var family_tuition_cap = this.family_tuition_cap();

    if (family_tuition > family_tuition_cap) {
        return family_tuition_cap;
    } else {
        return family_tuition;
    }
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

TuitionCalculator.prototype.first_child_tuition = function() {
    return this.capped_per_child_tuition();
}

TuitionCalculator.prototype.sibling_tuition = function() {
    return this.per_child_tuition() / 2;
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

TuitionCalculator.prototype.scale_for_part_time = function(family_tuition) {
    return family_tuition * this.multiplier;
}

TuitionCalculator.prototype.convert_tuition_to_monthly = function(family_tuition) {
    return (family_tuition / 10).toFixed();
}

TuitionCalculator.prototype.calculate = function() {
    return R.pipe(this.calculate_family_tuition.bind(this),
                  this.cap_tuition.bind(this),
                  this.convert_tuition_to_monthly.bind(this));
}

TuitionCalculator.prototype.tuition = function() {
    return this.calculate()();
}
