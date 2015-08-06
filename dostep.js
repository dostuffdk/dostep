(function() {
	this.Dostep = function(selectElm, settings) {
		var options = selectElm.options,
			selectedOption = options[selectElm.selectedIndex].value,
			selectedValue = options[selectElm.selectedIndex].text,
			stepper = setup();

		if (stepper === false) {
			return;
		}


		// React when clicking on - or +
		stepper.less.addEventListener('click', function(e) {
			e.preventDefault();
			step(-1);
		});

		stepper.more.addEventListener('click', function(e) {
			e.preventDefault();
			step(1);
		});

		// TODO: React to changes in the original select element

		function step(change) {
			for (var i = 0; i < options.length; i++) {
				if (selectedOption === options[i].value) {
					if (options[i+change]) {
						selectedOption = options[i+change].value;
						selectedValue = options[i+change].text;
						selectElm.value = selectedOption;
						stepper.value.innerHTML = selectedValue;
					}
					return;
				}
			}
		}

		function setup() {
			// Stop setting up if already set up
			if (selectElm.classList.contains('js-dostep--applied')) {
				return false;
			}

			// Merge default settings with provided settings
			var defaults = JSON.parse(JSON.stringify(defaultSettings));
			for (var property in settings) {
				if (settings.hasOwnProperty(property)) {
					defaults[property] = settings[property];
				}
			}
			settings = defaults;

			// Hide the original select element
			selectElm.classList.add('js-dostep--applied');
			selectElm.style.position = 'absolute';
			selectElm.style.top = '-9999px';
			selectElm.style.visibility = 'hidden';

			// Create the stepper and insert into DOM
			var stepper = createStepper(settings);
			selectElm.parentNode.insertBefore(stepper.container, selectElm.nextSibling);

			// Add selected option to stepper value
			stepper.value.innerHTML = selectedValue;

			return stepper;
		}
	};

	Dostep.prototype.destroy = function() {
		// TODO
		// Reset the styling
		// Cancel event listeners
		// Delete the stepper element
	};

	Dostep.prototype.step = function(stepValue) {
		// TODO
	};

	//// Private methods ////

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
