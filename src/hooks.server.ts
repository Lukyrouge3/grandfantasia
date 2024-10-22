import { cacheItems, loadItems, storeItems } from "$lib/gf/item";


console.time("Items loaded");
const items = loadItems("C_Item.ini", "T_Item.ini");
storeItems(items).then(() => {
	console.timeEnd("Items loaded");
});

console.time("Mall Items loaded");
const mall_items = loadItems("C_ItemMall.ini", "T_ItemMall.ini");
storeItems(mall_items).then(() => {
	console.timeEnd("Mall Items loaded");
});
