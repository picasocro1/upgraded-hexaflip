var hexaflipTextSlides = {
  setTextSlidesInProgress: false,
  threadMode: true,
  disableThreadMode: function() {
    hexaflipTextSlides.threadMode = false;
  },
  enableThreadMode: function() {
    hexaflipTextSlides.threadMode = true;
  },
  isThreadMode: function() {
    return hexaflipTextSlides.threadMode;
  },
  currentThread: 0,
  newThread: function() {
    return ++hexaflipTextSlides.currentThread;
  },
  isCurrentThread: function(thread) {
    if (hexaflipTextSlides.isThreadMode()) {
      return thread === hexaflipTextSlides.currentThread;
    } else {
      return true;
    }
  },
  whetherSlidesCanBeSet: function() {
    if (hexaflipTextSlides.isThreadMode()) {
      return true;
    } else {
      return !hexaflipTextSlides.setTextSlidesInProgress;
    }
  },
  linesOrgHTML: ''
};

hexaflipTextSlides.generateLines = function generateLines(container, rows) {
  var i, lineHTML = '<div class="line"></div>\n';
  container.innerHTML = '';

  for (i = 0; i < rows; i++) {
    container.innerHTML += lineHTML;
  }

  hexaflipTextSlides.linesOrgHTML = container.innerHTML;
};

hexaflipTextSlides.emptyLines = function emptyLines(number) {
  if (number <= 0) {
    return '';
  }

  var i, text = '';

  for (i = 0; i < number; i++) {
    text += endl;
  }

  return text;
};

hexaflipTextSlides.emojiStringToArray = function emojiStringToArray(str) {
  var split = str.split(/([\uD800-\uDBFF][\uDC00-\uDFFF])/);
  var arr = [];
  for (var i = 0; i < split.length; i++) {
    var char = split[i];
    if (char !== "") {
      arr.push(char);
    }
  }
  return arr;
};

hexaflipTextSlides.removeEmojiFromString = function removeEmojiFromString(str) {
  return str.replace(
    /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g,
    '');
};

hexaflipTextSlides.mixedStringToArray = function mixedStringToArray(str) {
  var src = str.split('');
  var dst = [];
  var emoji = '', emojiDetected = false;
  var i, j;

  for (i = 0; i < src.length; i++) {
    if (extendedAlphabet.indexOf(src[i]) == -1) {
      emoji += src[i];
      if (!emojiDetected) {
        emojiDetected = true;
      }

      if (emojisArray.indexOf(emoji) != -1) {
        dst.push(emoji);
        emojiDetected = false;
        emoji = '';
      }
    } else {
      if (emojiDetected) {
        dst.push(emoji);
        emojiDetected = false;
        emoji = '';
      }
      dst.push(src[i]);
    }
  }

  if (emojiDetected) {
    dst.push(emoji);
  }

  return dst;
};

hexaflipTextSlides.getWordElement = function getWordElement(alphabet, length, styleFn) {
  var element = {};
  for (var i = 0; i < length; i++) {
    element['l' + i] = getLetterElement(alphabet, i, styleFn);
  }

  function getLetterElement(letters, letterNo, styleFn) {
    var element = [], style;
    for (var i = 0; i < letters.length; i++) {

      element.push({
        value: letters[i]
      });

      if (styleFn) {
        style = styleFn(letterNo, i, letters[i]);
        if (style) {
          element[element.length - 1].style = style;
        }
      }
    }
    return element;
  }

  return element;
};

hexaflipTextSlides.setChosenWordInCubesLine = function setChosenWordInCubesLine(hexaTimeLine, word) {
  var i, element, setsLength = 0;
  word = hexaflipTextSlides.mixedStringToArray(word);

  for (var key in hexaTimeLine.sets) {
    if (hexaTimeLine.sets.hasOwnProperty(key)) {
      setsLength++;
    }
  }

  if (word.length > 0) {
    for (i = 0; i < Math.min(setsLength, word.length); i++) {
      element = {};
      element['l' + i] = word[i];
      hexaTimeLine.setValue(element);
    }
  }
};

hexaflipTextSlides.setSlides = function setSlides(slides, options, callback) {
  var thread = hexaflipTextSlides.newThread();

  if (hexaflipTextSlides.whetherSlidesCanBeSet()) {
    hexaflipTextSlides.setTextSlidesInProgress = true;

    var i, option, slideOptions;
    options = options || {};
    var defaults = {
      duration: 1000,
      textAlign: 'left',
      textVAlign: 'top',
      wordBreaking: true
    };

    for (option in defaults) {
      if (defaults.hasOwnProperty(option)) {
        options[option] = (options[option] !== undefined ? options[option] : defaults[option]);
      }
    }

    i = -1;

    promiseWhile(function() {
      i++;
      return i < slides.length && hexaflipTextSlides.isCurrentThread(thread);
    }, function() {
      var deferred = Q.defer();

      slides[i].options = slides[i].options || {};
      slideOptions = {};

      for (option in options) {
        if (options.hasOwnProperty(option)) {
          slides[i].options[option] = (slides[i].options[option] !== undefined ? slides[i].options[option] : options[option]);
          slideOptions[option] = slides[i].options[option];
        }
      }

      slideOptions.thread = thread;

      hexaflipTextSlides.setSlide(slides[i].text, slideOptions).done(function(remainText) {
        if (remainText && remainText.length > 0) {
          slides.splice(i + 1, 0, {
            text: remainText,
            options: slides[i].options
          });
        }
        deferred.resolve();
      });

      return deferred.promise;
    }).done(function() {
      hexaflipTextSlides.setTextSlidesInProgress = false;
      if (hexaflipTextSlides.isCurrentThread(thread) && callback) {
        callback();
      }
    });
  }
};

hexaflipTextSlides.setSlide = function setSlide(text, options) {
  var deferred = Q.defer();

  var i, j, currentHexaTimeNo = -1, maxHexaTimeNo = hexaTime.length - 1, currentHexaTime;
  var emptyFields = 0, emptyLine = space, fulfilled = false;

  options = options || {};

  if (maxHexaTimeNo < 0) {
    deferred.resolve();
    return deferred.promise;
  }

  var setsLength = 0;
  for (var key in hexaTime[0].sets) {
    if (hexaTime[0].sets.hasOwnProperty(key)) {
      setsLength++;
    }
  }

  var regExp = new RegExp('[ ' + endl + ']');
  text = text.split(regExp);

  prepareHAlignedTexts();
  prepareVAlignedTexts();

  for (i = 0; i < text.length; i++) {
    if (emptyFields <= 0 || emptyFields < text[i].length) {
      setNextHexaTime();

      if (emptyFields <= 0) {
        for (j = i; j < text.length; j++) {
          text[j] = text[j].trim(space);
        }

        setTimeout(function() {
          if (hexaflipTextSlides.isCurrentThread(options.thread)) {
            deferred.resolve(text.slice(i).join(space));
          } else {
            deferred.resolve();
          }
        }, options.duration);

        fulfilled = true;
        break;
      }
    }

    emptyFields -= text[i].length;

    hexaflipTextSlides.setChosenWordInCubesLine(currentHexaTime, text[i]);
  }

  if (!fulfilled) {
    for (i = 0; i < setsLength; i++) {
      emptyLine += space;
    }

    for (i = currentHexaTimeNo + 1; i <= maxHexaTimeNo; i++) {
      setNextHexaTime();

      hexaflipTextSlides.setChosenWordInCubesLine(currentHexaTime, emptyLine);
    }

    setTimeout(function() {
      deferred.resolve();
    }, options.duration);
  }

  return deferred.promise;

  function setNextHexaTime() {
    currentHexaTimeNo++;
    if (currentHexaTimeNo <= maxHexaTimeNo) {
      currentHexaTime = hexaTime[currentHexaTimeNo];
      emptyFields = setsLength;
    } else {
      currentHexaTimeNo = -1;
      currentHexaTime = undefined;
      emptyFields = 0;
    }
  }

  function prepareHAlignedTexts() {
    for (i = 0; i <= text.length - 1; i++) {
      if (i != 0) {
        if (text[i] != '' && text[i - 1].length + text[i].length <= setsLength) {
          text[i - 1] += text[i];

          if (text[i - 1].length < setsLength) {
            text[i - 1] += ' ';
          }

          text.splice(i, 1);
          i--;

          if (i == text.length - 1) {
            text[i] = completeTheLine(text[i]);
          }

          continue;
        } else if (text[i - 1].length < setsLength) {
          text[i - 1] = completeTheLine(text[i - 1]);
        }

        if (text[i] == '') {
          text[i] = completeTheLine('');
          continue;
        }
      }

      if (text[i].length > setsLength) {
        if (options.wordBreaking) {
          //if word breaking is enabled, split the word
          text.splice(i + 1, 0, text[i].substring(setsLength - 1));
          text[i] = text[i].substring(0, setsLength - 1) + jointChar;
        } else {
          //if word breaking is disabled, take up the text to max length
          text[i] = text[i].substring(0, setsLength);
        }
      } else if (text[i].length < setsLength) {
        text[i] = text[i] + space;
      }

      if (i == text.length - 1) {
        text[i] = completeTheLine(text[i]);
      }
    }
  }

  function completeTheLine(line) {
    var i, spacesBefore, completedLine = '';
    line = line.replace(/^[ ]+|[ ]+$/g, ''); //remove leading and trailing white spaces only
    //line = line.trim(space);

    var lineLength = hexaflipTextSlides.mixedStringToArray(line).length;

    if (options.textAlign == 'left') {
      spacesBefore = 0;
    }

    if (options.textAlign == 'right') {
      spacesBefore = Math.max(setsLength - lineLength, 0);
    }

    if (options.textAlign == 'center') {
      spacesBefore = Math.max(Math.floor((setsLength - lineLength) / 2), 0);
    }

    for (i = 0; i < spacesBefore; i++) {
      completedLine += space;
    }

    if (lineLength > setsLength) {
      completedLine += line.substring(0, setsLength);
    } else {
      completedLine += line;
    }

    for (i = Math.max(spacesBefore + lineLength - 1, 0); i < setsLength; i++) {
      completedLine += space;
    }

    return completedLine;
  }

  function prepareVAlignedTexts() {
    var i, emptyLine = '', count;

    if (text.length - 1 >= maxHexaTimeNo) {
      //do nothing here: text is already top, center and bottom vertically aligned
      return;
    }

    if (options.textVAlign == 'top') {
      //do nothing here: text is top aligned vertically by default
    }

    for (i = 0; i < setsLength; i++) {
      emptyLine += space;
    }

    if (options.textVAlign == 'bottom') {
      count = maxHexaTimeNo + 1 - text.length;
    } else if (options.textVAlign == 'center') {
      count = Math.floor((maxHexaTimeNo + 1 - text.length) / 2);
    }

    for (i = 0; i < count; i++) {
      text.splice(0, 0, emptyLine); //add as many empty lines as needed
    }
  }
};

function promiseWhile(condition, body) {
  var done = Q.defer();

  function loop() {
    // When the result of calling `condition` is no longer true, we are
    // done.
    if (!condition()) return done.resolve();
    // Use `when`, in case `body` does not return a promise.
    // When it completes loop again otherwise, if it fails, reject the
    // done promise
    Q.when(body(), loop, done.reject);
  }

  // Start running the loop in the next tick so that this function is
  // completely async. It would be unexpected if `body` was called
  // synchronously the first time.
  Q.nextTick(loop);

  // The promise
  return done.promise;
}

var extendedAlphabet = " 01234567890AĄBCĆDEĘFGHIJKLŁMNŃOÓPQRSŚTUVWXYZŹŻaąbcćdeęfghijklłmnńoópqrsśtuvwxyzźż!@#$%^^&*()-_=+[]{}:;–'\",.<>/?♥→".split('');
var emojis = "✝👍😄🐟💪✔💬🔥😊💡";
var emojisArray = hexaflipTextSlides.emojiStringToArray(emojis);
extendedAlphabet = extendedAlphabet.concat(emojisArray);
var endl = '◘', space = ' ', jointChar = '–';