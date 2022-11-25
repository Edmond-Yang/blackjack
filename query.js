class Element {
    constructor(selector) {
        if(selector[0] === "#")
            this.element = document.getElementById(selector.substring(1));
        else
            this.element = document.getElementsByClassName(selector.substring(1))[0];

    }

    get elements(){
        return this.element
    }

    get value(){
        return this.element.value;
    }

    get HTML(){
        return this.element.innerHTML;
    };

    set HTML(value) {
        this.element.innerHTML = value;
    };

    set appendHTML(value){

        if(this.HTML)
            this.HTML = this.HTML + value;
        else
            this.HTML = value;
        
    };

    set disabled(value){
        this.element.disabled = value;
        if(value)
            this.addClass = 'disabled';
        else
            this.removeClass = 'disabled';
    }

    set visible(value){
        this.element.style.visibility = value;
    }

    set addClass(name){
        this.element.classList.add(name);
    }

    set removeClass(name){
        this.element.classList.remove(name);
    }

    addListener (motion, functions) {
        this.element.addEventListener(motion, functions, false);
    };

    addListenerParameter(value){
        this.element.myParam = value;
    }

}