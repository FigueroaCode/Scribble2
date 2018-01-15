import { ElementRef,HostListener,Directive, OnInit } from '@angular/core';

@Directive({
    selector: 'ion-textarea[autosize]'
})

export class Autosize implements OnInit{

    //Is called whenever there is an input
    @HostListener('input',['$event.target'])
    onInput(textarea:HTMLTextAreaElement):void {
        this.adjust();
    }

    constructor(public element: ElementRef){
    }

    //adjust it when it is initially made
    ngOnInit(): void {
        setTimeout(() => this.adjust(),0);
    }

    //Style the textarea here
    adjust():void {
        let textarea = this.element.nativeElement.getElementsByTagName('textarea')[0];
        //This is for a dynamicly changing size
        // textarea.style.overflow = 'hidden';
        // textarea.style.height = 'auto';
        //
        // textarea.style.height = (textarea.scrollHeight + 5) + "px";

        //Dont let the user change the size of the textarea
        textarea.style.fontSize = '20px';
        textarea.style.resize = 'none';
        //Give it a fixed size
        textarea.style.height = '70vh';
    }
}
