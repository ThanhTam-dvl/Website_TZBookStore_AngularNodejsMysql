import { Component, ViewEncapsulation, OnDestroy, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminLayoutComponent implements AfterViewInit, OnDestroy {
  private scriptElements: HTMLScriptElement[] = [];
  private linkElements: HTMLLinkElement[] = [];

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadStyles();
      this.loadScripts();
    });
  }

  private loadStyles(): void {
    const cssFiles = [
      '/assets/admin/css/bootstrap.min.css',
      '/assets/admin/css/fontawesome.min.css',
      '/assets/admin/css/templatemo-style.css',
      '/assets/admin/css/font.css',
      'node_modules/@fortawesome/fontawesome-free/css/all.min.css',
    ];
    
    cssFiles.forEach((file) => {
      const linkElement = document.createElement('link');
      linkElement.rel = 'stylesheet';
      linkElement.href = file;
      document.head.appendChild(linkElement);
      this.linkElements.push(linkElement);
    });
  }

  private loadScripts(): void {
    const jsFiles = [
      '/assets/admin/js/jquery-3.3.1.min.js',
      '/assets/admin/js/bootstrap.min.js',
      '/assets/admin/js/Chart.min.js',
      '/assets/admin/js/moment.min.js',
      '/assets/admin/js/tooplate-scripts.js',
      '/assets/admin/js/chart-init.js',
    ];

    const loadScript = (index: number) => {
      if (index < jsFiles.length) {
        const scriptElement = document.createElement('script');
        scriptElement.src = jsFiles[index];
        scriptElement.type = 'text/javascript';
        scriptElement.onload = () => loadScript(index + 1);
        document.body.appendChild(scriptElement);
        this.scriptElements.push(scriptElement);
      }
    };

    loadScript(0);
  }

  ngOnDestroy(): void {
    this.scriptElements.forEach((script) => {
      if (script && document.body.contains(script)) {
        document.body.removeChild(script);
      }
    });

    this.linkElements.forEach((link) => {
      if (link && document.head.contains(link)) {
        document.head.removeChild(link);
      }
    });
  }
}
