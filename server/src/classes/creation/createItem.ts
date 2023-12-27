import Item, { ItemType } from "../item";
import Adamantium from "../items/materials/adamantium";
import Aluminum from "../items/materials/aluminum";
import Copper from "../items/materials/copper";
import Cotton from "../items/materials/cotton";
import Diamond from "../items/materials/diamond";
import Emerald from "../items/materials/emerald";
import Fabric from "../items/materials/fabric";
import Fiber from "../items/materials/fiber";
import Flint from "../items/materials/flint";
import Fur from "../items/materials/fur";
import Gold from "../items/materials/gold";
import Iron from "../items/materials/iron";
import Iron_Ingot from "../items/materials/iron_metal";
import Leather from "../items/materials/leather";
import Meteorite from "../items/materials/meteorite";
import Mithril from "../items/materials/mithril";
import Platinum from "../items/materials/platinum";
import Ruby from "../items/materials/ruby";
import Sand from "../items/materials/sand";
import Stone from "../items/materials/stone";
import Thatch from "../items/materials/thatch";
import Thread from "../items/materials/thread";
import Titanium from "../items/materials/titanium";
import Topaz from "../items/materials/topaz";
import Wood from "../items/materials/wood";

export const createItem = (type:ItemType, amount:number, uuid?:string):Item => {
    switch(type){
        case ItemType.Cotton:
            return new Cotton(amount, uuid);
        case ItemType.Thread:
            return new Thread(amount, uuid);
        case ItemType.Fabric:
            return new Fabric(amount, uuid);
        case ItemType.Leather:
            return new Leather(amount, uuid);
        case ItemType.Fur:
            return new Fur(amount, uuid);
        case ItemType.Fiber:
            return new Fiber(amount, uuid);
        case ItemType.Wood:
            return new Wood(amount, uuid);
        case ItemType.Thatch:
            return new Thatch(amount, uuid);
        case ItemType.Stone:
            return new Stone(amount, uuid);
        case ItemType.Flint:
            return new Flint(amount, uuid)
        case ItemType.Sand:
            return new Sand(amount, uuid);
        case ItemType.Iron:
            return new Iron(amount, uuid);
        case ItemType.Iron_Ingot:
            return new Iron_Ingot(amount, uuid);
        case ItemType.Aluminum:
            return new Aluminum(amount, uuid);
        case ItemType.Copper:
            return new Copper(amount, uuid);
        case ItemType.Gold:
            return new Gold(amount, uuid);
        case ItemType.Platinum:
            return new Platinum(amount, uuid);
        case ItemType.Mithril:
            return new Mithril(amount, uuid);
        case ItemType.Adamantium:
            return new Adamantium(amount, uuid);
        case ItemType.Titanium:
            return new Titanium(amount, uuid);
        case ItemType.Topaz:
            return new Topaz(amount, uuid);
        case ItemType.Ruby:
            return new Ruby(amount, uuid);
        case ItemType.Emerald:
            return new Emerald(amount, uuid);
        case ItemType.Diamond:
            return new Diamond(amount, uuid);
        case ItemType.Meteorite:
            return new Meteorite(amount, uuid);
    }
}