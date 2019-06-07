
/**** Javascript Design Calculator | Author : Joseph M. Davidson | Copyright @ 2016, all rights reserved. ****/

// Scientific/Design Calculator Module
var Calc = (function () {

    // Class : calculator object
    var calculator = function () {

        // display element and owned properties
        this.display = document.querySelector('.display');
        this.display.valid = /[0-9\s+%\(\)\*\/\+\-]/g;
        this.display.not_valid = /[^0-9^\s+^%^\(^\)^\*^\/^\+^\-]/g;

        // calculator memory property
        this.memory = '';
        this.solution = 0;
        this.all_clear = true;
    };
    calculator.values = function (display) {

        // split display by the space delimeter
        var arr = display.value.split(' ');

        // return last element
        return arr;

    }; // returns the entire array of values entered. example : 157 + 294, returns [157, +, 294]
    calculator.last_char = function (display) {

        // convert display to an array
        var arr = display.value.split('');

        // return the last element value
        return arr[arr.length - 1];

    }; // returns the string value for the last character in the display example: 123 returns 3
    calculator.is_what = function (variable) {

        // attempt to convert string to variable
        var attempt = Number(variable);

        // if did NOT auto convert to isNaN ( is a number )
        if (!isNaN(attempt)) { return 'number'; }
        else if (isNaN(attempt))// ( NOT a number )
        {
            if (variable === '.') { return 'decimal'; }// is a decimal
            else { return 'operand'; }// is an operand
        }
        // was none of the above
        return false;

    }; // checks a single character or symber. returns string values : 'number', 'operand', 'decimal'
    calculator.prototype.validate = function () {

        // reference the calculator display
        var display = this.display;

        // remove extra whitespace and replace unused characters with empty stirngs
        var cleared = display.value.replace(/\s+/g, ' ').replace(display.not_valid, '');

        // return a custom object : value = cleared value, valid = true or false "original text is valid"
        return { value: cleared, valid: display.value.match(display.not_valid) === null };

    }; // returns an object { value : corrected string, valid : bool if original string is valid }
    calculator.prototype.initialize = function () {

        // cipher this calculator object
        var c = this;

        // add event listener for keypress while on the display
        this.display.addEventListener('keyup', function (e) {

            // validate input
            var obj = c.validate();

            // go back a step if invalid
            if (!obj.valid) {
                this.value = obj.value;
            }
            // equals on keyboard = or enter, but not +
            if (e.keyCode === 187 && e.key !== '+' || e.keyCode === 13) {

                c.equals();
            }
        });

    }; // set's up input validation on keypress for the display
    calculator.prototype.mplus = function () {

        // set this.memory to this.display.value
        this.memory = this.display.value;

        // set all clear to true
        this.all_clear = true;

    }; // sets memory to current display value
    calculator.prototype.mclr = function () {

        // set this.memory to ''
        this.memory = '';

    }; // sets memory to an empty string
    calculator.prototype.mrec = function () {

        // digi === boolean value if last entry was a a digit
        var arr = this.display.value.split(' ');
        var digi = arr[arr.length - 1].match(/\d/) !== null ? true : false;

        // if last entry was a digit
        if (digi) {
            // set display value to the current memory value
            this.display.value = this.memory;
        }
        else // placing PI in front of operand
        {
            // set this.display.value to the current memory value
            this.add_val(this.memory);
        }

        // set all clear to false
        this.all_clear = true;

    }; // sets memory to current display value
    calculator.prototype.ac = function () {

        // clear the display value
        this.display.value = '';

        // all clear is on
        this.all_clear = true;

    }; // clears the calculator (AC)
    calculator.prototype.add_val = function (char) {

        // disallow more character's than max length of 20
        if (this.display.value.length > 20) { return; }

        // disallow multiple decimal points in a single entry
        var arr = this.display.value.split(' ');
        if (arr[arr.length - 1].indexOf('.') > -1 && char === '.') { return; }

        // if the all clear property is set or the last entry wasn't valid
        if (this.all_clear || this.display.value === 'NaN') {
            // if the char is a digit
            if (char.match(/\d/) !== null) {
                // set the new value to the number
                this.display.value = char;

                // set the all clear property to false
                this.all_clear = false;
            }
            else // char is an operand
            {
                if (char == '.') {
                    this.display.value += char;
                }
                else {
                    if (arr[0] !== "" && arr[arr.length - 1] !== ' ') {
                        // concatonate char surrounded by single white space to display value
                        this.display.value += ' ' + char + ' ';
                    }
                }

                // set the all clear property to false
                this.all_clear = false;
            }
        }
        else {
            // if char is a digit
            if (char.match(/\d/) !== null || char === '.') {
                // concatonate tha char to the display value
                this.display.value += char;
            }
            else if (arr[arr.length - 1] !== '') {
                // concatonate the operand surrounded by single white spaces to the display value
                this.display.value += ' ' + char + ' ';
            }
        }

    }; // adds a character value to the display
    calculator.prototype.equals = function () {

        // set display value to js math evaluation of display value
        this.display.value = eval(this.display.value);

        // set solution property to last solution
        this.solution = this.display.value;

        // all clear is on
        this.all_clear = true;

    }; // sets display.value to evaluated solution of display.value
    calculator.prototype.sqr = function () {

        // set the display value to the display value squared
        this.display.value = this.display.value * this.display.value;

    }; // sets display.value to the square of display.value
    calculator.prototype.sqrt = function () {

        // set the display value to the display value's square root
        this.display.value = Math.sqrt(this.display.value);

    }; // sets display.value to the square root of display.value
    calculator.prototype.pi = function () {

        // boolean value if last entry was an operand
        var oper = this.display.value.split(' ').length > 1 ? true : false;

        // if last entry was a digit
        if (!oper) {
            // set display value to PI
            this.display.value = Math.PI + '';
        }
        else // placing PI in front of operand
        {
            // concatonate PI to the display value
            this.add_val(Math.PI + '');
        }

    }; // sets display.value to 15 decimals of PI
    calculator.prototype.rad = function () {

        // set the display value to the the conersion of the value( degrees ) to radians
        this.display.value = Number(this.display.value) * Math.PI / 180;

    }; // converts display.value from degrees to radians
    calculator.prototype.tan = function () {

        // set the display value to it's tangent
        this.display.value = Math.tan(this.display.value);

    }; // sets display.value to the tangent of display.value
    calculator.prototype.atan = function () {

        // set the display value to it's arc-tangent
        this.display.value = Math.atan(this.display.value);

    }; // sets display.value to the arc-tangent of display.value
    calculator.prototype.deg = function () {

        // set the display value to the conersion of the value( radians ) to degrees
        this.display.value = this.display.value * 180 / Math.PI;

    }; // converts display.value from radians to degrees
    calculator.prototype.sin = function () {

        // set the display value to the sin of the display value
        this.display.value = Math.sin(this.display.value);

    }; // sets display value to it's sin
    calculator.prototype.cos = function () {

        // set the display value to the sin of the display value
        this.display.value = Math.cos(this.display.value);

    }; // sets display value to it's co-sin
    calculator.prototype.rand = function () {

        // cipher calulator object
        var c = this;

        // if number value is 0 or there are any non-digit values in display value
        if (!c.display.value || c.display.value == 0) {
            // set display to value between 1-100
            this.display.value = Math.floor(Math.random() * 100);
        }
        else {
            // calculate the last type of value entered
            var last_type = calculator.is_what(calculator.last_char(this.display));
            var values = calculator.values(this.display);

            // check what type last character was
            if (last_type === 'number') {
                // calculate the last value entered
                if (values.length > 1) {
                    // set the solution value to a random number between 0 and the last entered value
                    var random = Math.floor(Math.random() * 100);

                    // clear the display
                    this.display.value = '';

                    // construct display without last value
                    for (var x = 0; x < values.length - 1; x++) {
                        this.display.value += values[x] + ' ';
                    }

                    // add the solution as the new last value
                    this.display.value += random;
                }
                else {
                    // set the display value to a random number between 0 and the current display value
                    this.display.value = Math.floor(Math.random() * c.display.value);
                }
            }
            else if (last_type === 'operand') {
                // add a random between 1-100 after the operand
                this.display.value += Math.floor(Math.random() * 100);

            }
            else if (last_type === 'decimal') {
                // add a random between 0 - 9 after the decimal
                this.display.value += Math.floor(Math.random() * 9);
            }
        }

    }; // sets display value to random number between 0 and 100 or user's choice

    // create calculator object
    var c = new calculator();

    // initialize the object
    c.initialize();

    // return full exposure
    return c;

})();