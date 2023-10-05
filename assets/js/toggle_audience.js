function show_beginner(topic) {
    var container = document.getElementById("buttonContainer"+topic);
	var beginnerText = document.getElementById("beginnerText"+topic);
	var expertText = document.getElementById("expertText"+topic);
	var beginnerButton = document.getElementById("beginnerButton"+topic);
	var expertButton = document.getElementById("expertButton"+topic);
	// by default all the control elements are set to display: none
	// so that nothing can be seen if there is no java script. This shows them:
	container.style.display = "block";
	container.className = "audience-button-container";
	beginnerButton.style.display = "inline-block";
	expertButton.style.display = "inline-block";

	// update button style
	beginnerButton.className = "audience-button beginner active";
	expertButton.className = "audience-button expert inactive";

	// show the right things
	beginnerText.style.display = "block";
	expertText.style.display = "none";
} 
function show_expert(topic) {
    var container = document.getElementById("buttonContainer"+topic);
	var beginnerText = document.getElementById("beginnerText"+topic);
	var expertText = document.getElementById("expertText"+topic);
	var beginnerButton = document.getElementById("beginnerButton"+topic);
	var expertButton = document.getElementById("expertButton"+topic);
	// by default all the control elements are set to display: none
	// so that nothing can be seen if there is no java script.
	container.style.display = "block";
	container.className = "audience-button-container";
	beginnerButton.style.display = "inline-block";
	expertButton.style.display = "inline-block";

	// update button style
	beginnerButton.className = "audience-button beginner inactive";
	expertButton.className = "audience-button beginner active";
	
	// show the right things
	beginnerText.style.display = "none";
	expertText.style.display = "block";
} 
