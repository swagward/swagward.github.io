export class Inventory {
    constructor(maxSize = 3) {
        this.maxSize = maxSize;
        this.items = [];
        this.currentSlotIndex = 0; //Will be the tracker for what you're currently holding
    }

    addItem(item) {
        if(this.items.length < this.maxSize) {
            this.items.push(item);
            console.log(`${item.name} added to inventory`);
            return true;
        } else {
            return false;
        }
    }

    removeItem(index) {
        if(index >= 0 && index < this.items.length) {
            this.items.splice(index, 1);
        }
    }

    getHeldItem() {
        return this.items[this.currentSlotIndex];
    }

    switchItem(direction) {
        if(this.items.length > 0) {
            this.getHeldItem().unequip();
            this.currentSlotIndex = (this.currentSlotIndex + direction + this.items.length) % this.items.length;
            this.getHeldItem().equip();
        }
    }
}