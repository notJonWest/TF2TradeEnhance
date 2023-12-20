contentSites["scrap.tf"] = () =>
{
	refreshReadability = () =>
	{
		for (let item of [...$$All(".item")])
		{
			if (!item.parentNode.parentNode.parentNode.classList.contains("search-outside"))
			{
				let dataContent = item.getAttribute("data-content");
				
				let craftIndex = dataContent.indexOf("Craft #") + 6;
				if (craftIndex !== 5)
				{
					if (item.querySelector("div.cratetext") !== null)
						item.querySelector("div.cratetext").style.display = "none";
					let craft = dataContent.substring(craftIndex, dataContent.indexOf("<", craftIndex));
					item.insertAdjacentHTML("beforeend", `<span class='itemCraft'>${craft}</span>`);
				}
				
				let lvlIndex = dataContent.indexOf("Level ") + 6;
				if (lvlIndex !== 5)
				{
					let lvl = dataContent.substring(lvlIndex, dataContent.indexOf("<", lvlIndex));
					item.insertAdjacentHTML("beforeend", `<span class='itemLvl'>Lvl${lvl}</span>`);
				}
				
				//User applied Names/Descriptions are surrounded by "
				let hasName = item.getAttribute("data-title").indexOf("\"") !== -1;
				let hasDesc = dataContent.startsWith("\""); //Described items begin with the description
				if (hasName || hasDesc)
					item.insertAdjacentHTML("beforeend", `<span class="itemFraudWarning"></span>`);

				//the boxshadow stuff is a remnant of when I used to have a border for spelled items
				//it prevented part border and spell border from hiding each other
				//might need it again at some point, so I'm keeping it here
				let boxShadowSize = 0;
				let boxShadowComma = "";
				
				let partIndex = dataContent.indexOf("<span style='color:#CF6A32'>Strange Part:");
				if (partIndex !== -1)
				{
					boxShadowSize++;
					item.style.boxShadow += `${boxShadowComma}0 0 0 ${boxShadowSize*2}pt #0c0`;
					boxShadowComma = ", ";
				}
			}
		};
	};

	let useScrapTF = document.createElement("script");
	useScrapTF.src = chrome.runtime.getURL("ScrapTF/useScrapTF.js");
	$$("body").appendChild(useScrapTF);
};