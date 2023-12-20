contentSites[location.host.toLowerCase()]();

let header = null;
if ($$(".navbar-header") !== null)
	header = $$(".navbar-header");
else
	header = $$("#inventory_logos");

header.insertAdjacentHTML("afterbegin",
	`<button id="refreshReadability">
		<i class="fa fa-sync"></i>
	</button>`);
$$("#refreshReadability").addEventListener("click", refreshReadability);
window.addEventListener("load",	refreshReadability);