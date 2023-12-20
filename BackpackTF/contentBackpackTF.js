contentSites["backpack.tf"] = () =>
{
	refreshReadability = () =>
	{
		let noLvlTypes = [
			"Kit",
			"Craft Item",
			"Tool",
			"Recipe",
			"Supply Crate",
			"Robot Part",
			"Usable Item",
			"Party Favor",
			"Pass",
			"Tracker"
		];
		for (let item of [...$$All(".item")])
		{
			itemLvl = item.getAttribute("data-level");
			if (item.getAttribute("data-quality") !== "15" && //Decorated Quality will always be predefined
				item.getAttribute("data-quality") !== "1" && //Genuine Quality will always be predefined
				itemLvl !== null && //Covers empty spaces and unleveled buy listings
				!noLvlTypes.some(t => item.getAttribute("data-summary").includes(t)))
			{
				let tlTag = item.querySelector(".tag.top-left");
				let lvTxt = `Lv${itemLvl}`;
				if (tlTag === null)
					item.insertAdjacentHTML("afterbegin", `<div class="tag top-left">${lvTxt}</div>`);
				else
					tlTag.innerHTML = `${lvTxt}</br>${tlTag.innerHTML}`;
			}
				
			if (item.getAttribute("data-custom_name") !== null ||
				item.getAttribute("data-custom_desc") !== null)
				item.insertAdjacentHTML("beforeend", `<span class="itemFraudWarning"></span>`);
			
			
			if (item.getAttribute("data-spell_1") !== null) //Spells
			{
				let iconStack = item.querySelector(".icon-stack");
				if (iconStack === null)
				{
					iconStack = document.createElement("div");
					iconStack.classList.add("icon-stack");
					item.appendChild(iconStack);
				}
				let spellIcon = document.createElement("div");
				spellIcon.classList.add("spelled-item");
				spellIcon.innerHTML = `<i class="fa fa-magic"></i>`;
				iconStack.appendChild(spellIcon);
			}
			if (item.getAttribute("data-part_name_1") !== null) //Strange Part
			{
				let iconStack = item.querySelector(".icon-stack");
				if (iconStack === null)
				{
					iconStack = document.createElement("div");
					iconStack.classList.add("icon-stack");
					item.appendChild(iconStack);
				}
				let partIcon = document.createElement("div");
				partIcon.classList.add("strangepart-item");
				partIcon.innerHTML = `<i class="fa fa-wrench"></i>`;
				iconStack.appendChild(partIcon);
			}
		}
	}
}