import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'sanitizeHtml',
})
export class SanitizeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  // transform(value: string): SafeHtml {
  //   return this.sanitizer.bypassSecurityTrustHtml(value);
  // }
  transform(html: string | SafeHtml | null): SafeHtml {
    if (html === null) {
      return '';
    }
    
    if (typeof html === 'string') {
      return this.sanitizer.bypassSecurityTrustHtml(html);
    }
    
    // It's already SafeHtml, so return as is
    return html;
  }
  
}
