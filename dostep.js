(function() {
	this.Dostep = function(selectElm, settings) {
		// Stop if already set up
		if (selectElm.classList.contains('js-dostep--applied')) {
			return false;
		}

		// Merge settings
		var defaults = JSON.parse(JSON.stringify(defaultSettings));
		for (var property in settings) {
			if (settings.hasOwnProperty(property)) {
				defaults[property] = settings[property];
			}
		}
		settings = defaults;

		// Hide the original select element
		selectElm.classList.add('js-dostep--applied');
		// TODO: Move to css
		selectElm.style.position = 'absolute';
		selectElm.style.top = '-9999px';
		selectElm.style.visibility = 'hidden';

		// Create the stepper and insert into DOM
		this.stepper = createStepper(settings);
		selectElm.parentNode.insertBefore(this.stepper.container, selectElm.nextSibling);

		// Information about selected value
		this.selectElm = selectElm;
		this.selectedOption = this.selectElm.options[selectElm.selectedIndex].value,
		this.selectedValue = this.selectElm.options[selectElm.selectedIndex].text;

		// Add selected option to stepper value
		this.stepper.value.innerHTML = this.selectedValue;

		// React when clicking on - or +
		this.prevHandler = this.prev.bind(this);
		this.nextHandler = this.next.bind(this);
		this.stepper.less.addEventListener('click', this.prevHandler);
		this.stepper.more.addEventListener('click', this.nextHandler);

		// TODO: React to changes in the original select element
	};

	Dostep.prototype.step = function(change) {
		for (var i = 0; i < this.selectElm.options.length; i++) {
			if (this.selectedOption === this.selectElm.options[i].value) {
				if (this.selectElm.options[i+change]) {
					this.selectedOption = this.selectElm.options[i+change].value;
					this.selectedValue = this.selectElm.options[i+change].text;
					this.selectElm.value = this.selectedOption;
					this.stepper.value.innerHTML = this.selectedValue;
				}
				return;
			}
		}
	};

	Dostep.prototype.next = function(e) {
		e.preventDefault();
		this.step(1);
	};

	Dostep.prototype.prev = function(e) {
		e.preventDefault();
		this.step(-1);
	};

	Dostep.prototype.destroy = function() {
		// Cancel event listeners
		this.stepper.less.removeEventListener('click', this.prevHandler);
		this.stepper.more.removeEventListener('click', this.nextHandler);

		// Remove the stepper element
		this.stepper.container.parentElement.removeChild(this.stepper.container);

		// Reset the styling of original select element
		this.selectElm.classList.remove('js-dostep--applied');
		this.selectElm.style.position = 'static';
		this.selectElm.style.top = 'auto';
		this.selectElm.style.visibility = 'visible';
	};

	//// Private stuff ////

	var defaultSettings = {
		elmClassName: 'dostep',
		lessClassName: 'dostep__control dostep__control--less',
		moreClassName: 'dostep__control dostep__control--more',
		valueClassName: 'dostep__value'
	};

	function createStepper(settings) {
		var stepper = document.createElement('div'),
			less = createStepperControl('LESS', settings),
			more = createStepperControl('MORE', settings),
			value = createStepperValue(settings)

		addClassString(stepper, settings.elmClassName);

		stepper.appendChild(less);
		stepper.appendChild(value);
		stepper.appendChild(more);

		return {
			container: stepper,
			less: less,
			more: more,
			value: value
		}
	}

	function createStepperValue(settings) {
		var stepperValue = document.createElement('div');
		addClassString(stepperValue, settings.valueClassName);
		return stepperValue;
	}

	function createStepperControl(type, settings) {
		var stepperControl = document.createElement('a');
		stepperControl.href = '';
		switch (type) {
			case 'LESS':
				addClassString(stepperControl, settings.lessClassName);
				stepperControl.innerHTML = '-';
				break;
			case 'MORE':
				addClassString(stepperControl, settings.moreClassName);
				stepperControl.innerHTML = '+';
				break;
		}

		return stepperControl;
	}

	//// Utility methods ////

	function addClassString(elm, classString) {
		classString.split(' ').forEach(function(className) {
 			elm.classList.add(className);
		});
	}
}());
