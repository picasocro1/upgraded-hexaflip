# upgraded-hexaflip
This is extended version of hexaflip idea. Based on original: https://github.com/dmotz/hexaflip 

## Demo
* [datetime](https://demo.picasocro1.2ap.pl/upgraded-hexaflip/upgraded-hexaflip-datetime.html "Upgraded-hexaflip-datetime example")
* [text slides](https://demo.picasocro1.2ap.pl/upgraded-hexaflip/upgraded-hexaflip-text-slides.html "Upgraded-hexaflip-texts-slides example")

## What has been upgraded?

Based params list has been extended:

```javascript
defaults = {
  size: 200,
  margin: 10,
  fontSize: 132,
  perspective: 1000,
  perspectiveOrigin: '50% 50%',
  touchSensitivity: 1,
  horizontalFlip: false,
  domEvents: null,
  yearMin: 0,
  yearMax: new Date().getFullYear()
};
```
A few bugs has been fixed (for example problem with touch interactions).

Year's (rectangular) block has been added (but only vertical flip is handle here).

CSS has been upgraded to handle new year feature.

Presentation on slides has been programmed (in separate library).

### Datetime

Example of datatime init:

```javascript
hexaTime.setValue({
  year: '2017',
  month: '03',
  day: '21',
  hour: '14',
  minute: '03'
});
```
### Text slides

Example of complex text slides configuration:

```javascript
hexaflipTextSlides.setSlides([{
  text: '💬💬💬'
},{
  text: 'welcome! this is demo of hexaflip textslides.'
}, {
  text: 'the library allows display chosen texts on cubes.'
}, {
  text: 'paragraphs can be grouped into slides with a defined duration and aligns.'
}, {
  text: 'for example this is slide with right horizontal and bottom vertical align and shorter duration time.',
  options: {
    textAlign: 'right',
    textVAlign: 'bottom',
    duration: 2700
  }
}, {
  text: 'that one has different aligns, and longer duration time.',
  options: {
    textAlign: 'left',
    textVAlign: 'top',
    duration: 6000
  }
}, {
  text: 'you can adjust the STYLE of the chosen cubes.',
  options: {
    textAlign: 'center'
  }
}, {
  text: 'feel free to use it as you want! ✔',
  options: {
    duration: 300 //time to execute callback after last slide
  }
}], {
  duration: 4000,
  textAlign: 'center',
  textVAlign: 'top',
  wordBreaking: true
}, callbackFn);
```

Main slides options are overwritten by single slide option (if existed).

More details in **upgraded-hexaflip-text-slides.html** example file.