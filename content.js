let $$ = selector => document.querySelector(selector);
let $$All = selector => document.querySelectorAll(selector);

let refreshReadability = () =>
{
	console.log("This site is not fully supported by the TF2_TradeEnhance extention.");
}

switch (location.host)
{
	case "scrap.tf":
		contentScrapTF();
		break;
	case "backpack.tf":
		contentBackpackTF();
		break;
}

$$(".navbar-header").insertAdjacentHTML("afterbegin",
	`<button id="refreshReadability">
		<i class="fa fa-refresh" aria-hidden="true"></i>
	</button>`);
$$("#refreshReadability").addEventListener("click", refreshReadability);
window.addEventListener("load",	refreshReadability);