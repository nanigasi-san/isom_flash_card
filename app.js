(function (global) {
  "use strict";

  var SESSION_LENGTH = 10;
  var ASSET_PATHS = [
    "ISOM/101_Contour.svg",
    "ISOM/102_Index contour.svg",
    "ISOM/103_Form line.svg",
    "ISOM/104_Earth bank.svg",
    "ISOM/105.1_Earth wall.svg",
    "ISOM/105.2_Retaining earth wall.svg",
    "ISOM/106_Ruined earth wall.svg",
    "ISOM/107_Erosion gully.svg",
    "ISOM/108_Small erosion gully.svg",
    "ISOM/109_Small knoll.svg",
    "ISOM/110_Small elongated knoll.svg",
    "ISOM/111_Small depression.svg",
    "ISOM/112_Pit.svg",
    "ISOM/113_Broken ground.svg",
    "ISOM/114_Very broken ground.svg",
    "ISOM/115_Prominent landform feature.svg",
    "ISOM/201_Impassable cliff.svg",
    "ISOM/202_Cliff.svg",
    "ISOM/203.1_Rocky pit or cave.svg",
    "ISOM/203.2_Dangerous pit.svg",
    "ISOM/204_Boulder.svg",
    "ISOM/205_Large boulder.svg",
    "ISOM/206_Gigantic boulder or rock pillar.svg",
    "ISOM/207_Boulder cluster.svg",
    "ISOM/208_Boulder field.svg",
    "ISOM/209_Dense boulder field.svg",
    "ISOM/210_Stony ground, slow running.svg",
    "ISOM/211_Stony ground, walk.svg",
    "ISOM/212_Stony ground, fight.svg",
    "ISOM/213_Sandy ground.svg",
    "ISOM/214_Bare rock.svg",
    "ISOM/215_Trench.svg",
    "ISOM/301_Uncrossable body of water.svg",
    "ISOM/302_Shallow body of water.svg",
    "ISOM/303_Waterhole.svg",
    "ISOM/304_Crossable watercourse.svg",
    "ISOM/305_Small crossable watercourse.svg",
    "ISOM/306_Minor - seasonal water channel.svg",
    "ISOM/307_Uncrossable marsh.svg",
    "ISOM/308_Marsh.svg",
    "ISOM/309_Narrow marsh.svg",
    "ISOM/310_Indistinct marsh.svg",
    "ISOM/311_Well, fountain or water tank.svg",
    "ISOM/312_Spring.svg",
    "ISOM/313_Prominent water feature.svg",
    "ISOM/401_Open land.svg",
    "ISOM/402_Open land with scattered trees.svg",
    "ISOM/403_Rough open land.svg",
    "ISOM/404_Rough open land with scattered trees.svg",
    "ISOM/405_Forest.svg",
    "ISOM/406_Vegetation - slow running.svg",
    "ISOM/407_Vegetation - slow running, good visibility.svg",
    "ISOM/408_Vegetation - walk.svg",
    "ISOM/409_Vegetation - walk, good visibility.svg",
    "ISOM/410_Vegetation - fight.svg",
    "ISOM/412_Cultivated land.svg",
    "ISOM/413_Orchard.svg",
    "ISOM/414_Vineyard or similar.svg",
    "ISOM/415_Distinct cultivation boundary.svg",
    "ISOM/416_Distinct vegetation boundary.svg",
    "ISOM/417_Prominent large tree.svg",
    "ISOM/418_Prominent bush or tree.svg",
    "ISOM/419_Prominent vegetation feature.svg",
    "ISOM/501_Paved area.svg",
    "ISOM/502_Wide road.svg",
    "ISOM/503_Road.svg",
    "ISOM/504_Vehicle track.svg",
    "ISOM/505_Footpath.svg",
    "ISOM/506_Small footpath.svg",
    "ISOM/507_Less distinct small footpath.svg",
    "ISOM/508_Narrow ride or linear trace through the terrain.svg",
    "ISOM/509_Railway.svg",
    "ISOM/510_Power line, cableway or skilift.svg",
    "ISOM/511_Major power line.svg",
    "ISOM/512_Bridge - tunnel.svg",
    "ISOM/513.1_Wall.svg",
    "ISOM/513.2_Retaining wall.svg",
    "ISOM/514_Ruined wall.svg",
    "ISOM/515_Impassable wall.svg",
    "ISOM/516_Fence.svg",
    "ISOM/517_Ruined fence.svg",
    "ISOM/518_Impassable fence.svg",
    "ISOM/519_Crossing point.svg",
    "ISOM/520_Area that shall not be entered.svg",
    "ISOM/521_Building.svg",
    "ISOM/522_Canopy.svg",
    "ISOM/523_Ruin.svg",
    "ISOM/524_High tower.svg",
    "ISOM/525_Small tower.svg",
    "ISOM/526_Cairn.svg",
    "ISOM/527_Fodder rack.svg",
    "ISOM/528_Prominent line feature.svg",
    "ISOM/529_Prominent impassable line feature.svg",
    "ISOM/530_Prominent man - made feature - ring.svg",
    "ISOM/531_Prominent man - made feature - x.svg",
    "ISOM/532_Stairway.svg",
    "ISOM/601_Magnetic north line.svg",
    "ISOM/602_Registration mark.svg",
    "ISOM/603_Spot heigh.svg",
    "ISOM/701_Start.svg",
    "ISOM/702_Map issue point.svg",
    "ISOM/703_Control point.svg",
    "ISOM/704_Control number.svg",
    "ISOM/705_Course line.svg",
    "ISOM/706_Finish.svg",
    "ISOM/707_Marked route.svg",
    "ISOM/708_Out - of - bounds boundary.svg",
    "ISOM/709_Out - of - bounds area.svg",
    "ISOM/710_Crossing point.svg",
    "ISOM/711_Out - of - bounds route.svg",
    "ISOM/712_First aid post.svg",
    "ISOM/713_Refreshment point.svg",
    "ISOM/715_Continuing point after map exchange.svg"
  ];

  function parseIsomAssetPath(svgPath) {
    var normalizedPath = String(svgPath).replace(/\\/g, "/");
    var fileName = normalizedPath.split("/").pop();
    var match = fileName.match(/^([0-9]+(?:\.[0-9]+)?)_(.+)\.svg$/i);

    if (!match) {
      throw new Error("Unexpected ISOM asset name: " + svgPath);
    }

    return {
      id: normalizedPath,
      number: match[1],
      name: match[2],
      svgPath: normalizedPath
    };
  }

  function buildDataset(assetPaths) {
    return assetPaths.map(parseIsomAssetPath);
  }

  var ISOM_ITEMS = buildDataset(ASSET_PATHS);
  var UNIQUE_NAMES = Array.from(
    new Set(
      ISOM_ITEMS.map(function (item) {
        return item.name;
      })
    )
  );

  var MODES = {
    "name-from-symbol-number": {
      id: "name-from-symbol-number",
      title: "記号 + 番号 -> 名称",
      description: "記号と番号を見て、正しい名称を6択から選ぶ",
      answerType: "name",
      promptFields: ["symbol", "number"]
    },
    "number-from-symbol-name": {
      id: "number-from-symbol-name",
      title: "記号 + 名称 -> 番号",
      description: "記号と名称を見て、正しい番号を6択から選ぶ",
      answerType: "number",
      promptFields: ["symbol", "name"]
    },
    "symbol-from-number": {
      id: "symbol-from-number",
      title: "番号 -> 記号",
      description: "番号を見て、正しい記号を6択から選ぶ",
      answerType: "symbol",
      promptFields: ["number"]
    }
  };

  var state = {
    selectedModeId: "name-from-symbol-number",
    session: null,
    selectedOptionKey: null
  };

  function shuffle(array) {
    var copy = array.slice();
    for (var index = copy.length - 1; index > 0; index -= 1) {
      var swapIndex = Math.floor(Math.random() * (index + 1));
      var current = copy[index];
      copy[index] = copy[swapIndex];
      copy[swapIndex] = current;
    }
    return copy;
  }

  function sampleUnique(array, count) {
    if (count > array.length) {
      throw new Error("Not enough values to sample " + count + " unique entries.");
    }
    return shuffle(array).slice(0, count);
  }

  function createNameOption(name) {
    return {
      key: "name:" + name,
      type: "name",
      label: name,
      value: name
    };
  }

  function createItemOption(answerType, item) {
    return {
      key: item.id,
      type: answerType,
      label: answerType === "number" ? item.number : item.name,
      item: item
    };
  }

  function createModeOptions(mode, correctItem) {
    if (mode.answerType === "name") {
      var namePool = UNIQUE_NAMES.filter(function (name) {
        return name !== correctItem.name;
      });

      return shuffle(
        [createNameOption(correctItem.name)].concat(
          sampleUnique(namePool, 5).map(createNameOption)
        )
      );
    }

    var distractors = sampleUnique(
      ISOM_ITEMS.filter(function (item) {
        return item.id !== correctItem.id;
      }),
      5
    );

    return shuffle(
      [createItemOption(mode.answerType, correctItem)].concat(
        distractors.map(function (item) {
          return createItemOption(mode.answerType, item);
        })
      )
    );
  }

  function createQuestions(modeId) {
    var mode = MODES[modeId];
    var selectedItems = sampleUnique(ISOM_ITEMS, SESSION_LENGTH);

    return selectedItems.map(function (correctItem, index) {
      return {
        id: modeId + ":" + index + ":" + correctItem.id,
        modeId: modeId,
        correctItem: correctItem,
        options: createModeOptions(mode, correctItem),
        promptFields: mode.promptFields.slice(),
        answerType: mode.answerType,
        selectedKey: null
      };
    });
  }

  function createSession(modeId) {
    return {
      modeId: modeId,
      questions: createQuestions(modeId),
      currentIndex: 0,
      completed: false,
      score: 0
    };
  }

  function isQuestionAnswered(question) {
    return Boolean(question.selectedKey);
  }

  function isCorrectSelection(question) {
    if (!question.selectedKey) {
      return false;
    }

    if (question.answerType === "name") {
      return question.selectedKey === "name:" + question.correctItem.name;
    }

    return question.selectedKey === question.correctItem.id;
  }

  function finalizeSession(session) {
    var score = session.questions.reduce(function (total, question) {
      return total + (isCorrectSelection(question) ? 1 : 0);
    }, 0);

    session.score = score;
    session.completed = true;
    return session;
  }

  function currentQuestion(session) {
    return session.questions[session.currentIndex];
  }

  function encodedAssetPath(svgPath) {
    return encodeURI(svgPath).replace(/#/g, "%23");
  }

  function getMode(modeId) {
    return MODES[modeId];
  }

  function optionText(option) {
    if (option.type === "name") {
      return option.value;
    }
    if (option.type === "number") {
      return option.item.number;
    }
    return option.item.number + " / " + option.item.name;
  }

  function createElement(tagName, className, textContent) {
    var element = document.createElement(tagName);
    if (className) {
      element.className = className;
    }
    if (typeof textContent === "string") {
      element.textContent = textContent;
    }
    return element;
  }

  function renderModeSelector() {
    var root = document.getElementById("mode-selector");
    root.innerHTML = "";

    Object.keys(MODES).forEach(function (modeId) {
      var mode = MODES[modeId];
      var button = createElement("button", "mode-button");
      button.type = "button";
      button.dataset.modeId = modeId;
      button.setAttribute("role", "radio");
      button.setAttribute("aria-checked", String(state.selectedModeId === modeId));
      if (state.selectedModeId === modeId) {
        button.classList.add("active");
      }

      var title = createElement("span", "mode-title", mode.title);
      var description = createElement("span", "mode-description", mode.description);
      button.appendChild(title);
      button.appendChild(description);

      button.addEventListener("click", function () {
        if (state.session && !state.session.completed) {
          return;
        }

        state.selectedModeId = modeId;
        updateSidebar();
        render();
      });

      root.appendChild(button);
    });
  }

  function updateSidebar() {
    var selectedModeTitle = document.getElementById("selected-mode-title");
    var sessionStatus = document.getElementById("session-status");
    var startButton = document.getElementById("start-button");
    var count = document.getElementById("item-count");

    selectedModeTitle.textContent = getMode(state.selectedModeId).title;
    count.textContent = ISOM_ITEMS.length + " symbols";

    if (!state.session) {
      sessionStatus.textContent = "開始前";
      startButton.disabled = false;
      startButton.textContent = "10問スタート";
      return;
    }

    if (state.session.completed) {
      sessionStatus.textContent = "結果表示中";
      startButton.disabled = false;
      startButton.textContent = "同じモードでもう一度";
      return;
    }

    sessionStatus.textContent = state.session.currentIndex + 1 + " / " + SESSION_LENGTH;
    startButton.disabled = true;
    startButton.textContent = "プレイ中";
  }

  function renderPromptField(field, item) {
    if (field === "symbol") {
      var frame = createElement("div", "symbol-frame");
      var image = createElement("img");
      image.src = encodedAssetPath(item.svgPath);
      image.alt = item.number + " " + item.name;
      frame.appendChild(image);
      return frame;
    }

    return createElement("div", "prompt-pill", field === "number" ? item.number : item.name);
  }

  function promptTitle(question) {
    if (question.modeId === "name-from-symbol-number") {
      return "この記号の名称はどれ？";
    }
    if (question.modeId === "number-from-symbol-name") {
      return "この記号の番号はどれ？";
    }
    return "この番号に対応する記号はどれ？";
  }

  function renderQuestionPrompt(question) {
    var promptCard = createElement("section", "prompt-card");
    promptCard.appendChild(createElement("p", "panel-label", "Prompt"));
    promptCard.appendChild(createElement("h3", "", promptTitle(question)));

    var meta = createElement("div", "prompt-meta");
    question.promptFields.forEach(function (field) {
      if (field !== "symbol") {
        meta.appendChild(renderPromptField(field, question.correctItem));
      }
    });

    if (meta.childNodes.length > 0) {
      promptCard.appendChild(meta);
    }

    if (question.promptFields.indexOf("symbol") >= 0) {
      promptCard.appendChild(renderPromptField("symbol", question.correctItem));
    }

    return promptCard;
  }

  function renderChoiceButton(question, option) {
    var isSelected = question.selectedKey === option.key;
    var button = createElement("button", "choice-button");
    button.type = "button";
    button.dataset.optionKey = option.key;
    if (isSelected) {
      button.classList.add("selected");
    }

    if (question.answerType === "symbol") {
      button.classList.add("symbol-option");
      button.setAttribute("aria-label", optionText(option));

      var symbolFrame = createElement("div", "symbol-frame");
      var image = createElement("img");
      image.src = encodedAssetPath(option.item.svgPath);
      image.alt = "";
      symbolFrame.appendChild(image);
      button.appendChild(symbolFrame);
      button.appendChild(createElement("span", "sr-only", optionText(option)));
    } else {
      button.appendChild(createElement("span", "choice-value", option.label));
      button.appendChild(
        createElement("span", "option-hint", question.answerType === "name" ? "NAME" : "NUMBER")
      );
    }

    button.addEventListener("click", function () {
      state.selectedOptionKey = option.key;
      question.selectedKey = option.key;
      render();
    });

    return button;
  }

  function renderQuizScreen(session) {
    var mode = getMode(session.modeId);
    var question = currentQuestion(session);
    var screen = createElement("div", "quiz-screen");

    var header = createElement("section", "quiz-header");
    var progress = createElement("div", "progress-row");
    progress.appendChild(createElement("span", "progress-chip", "Q " + (session.currentIndex + 1) + " / " + SESSION_LENGTH));
    progress.appendChild(createElement("span", "panel-label", mode.title));
    header.appendChild(progress);
    header.appendChild(createElement("h2", "", promptTitle(question)));
    header.appendChild(createElement("p", "", "6択からひとつ選んで進みます。正誤は最後にまとめて確認します。"));
    screen.appendChild(header);

    var layout = createElement("div", "question-layout");
    layout.appendChild(renderQuestionPrompt(question));

    var answerPanel = createElement("section", "answer-panel");
    answerPanel.appendChild(createElement("p", "panel-label", "Choices"));
    var choiceGrid = createElement("div", "choice-grid" + (question.answerType === "symbol" ? " symbol-grid" : ""));
    question.options.forEach(function (option) {
      choiceGrid.appendChild(renderChoiceButton(question, option));
    });
    answerPanel.appendChild(choiceGrid);

    var actions = createElement("div", "choice-actions");
    actions.appendChild(createElement("p", "", question.selectedKey ? "選択済みです。" : "回答を選ぶと次へ進めます。"));

    var nextButton = createElement(
      "button",
      "primary-button",
      session.currentIndex === SESSION_LENGTH - 1 ? "結果を見る" : "次の問題へ"
    );
    nextButton.type = "button";
    nextButton.disabled = !isQuestionAnswered(question);
    nextButton.addEventListener("click", function () {
      if (!isQuestionAnswered(question)) {
        return;
      }

      if (session.currentIndex === SESSION_LENGTH - 1) {
        finalizeSession(session);
      } else {
        session.currentIndex += 1;
        state.selectedOptionKey = currentQuestion(session).selectedKey;
      }
      updateSidebar();
      render();
    });

    actions.appendChild(nextButton);
    answerPanel.appendChild(actions);
    layout.appendChild(answerPanel);
    screen.appendChild(layout);

    return screen;
  }

  function createTriadItem(label, value) {
    var card = createElement("div", "triad-item");
    card.appendChild(createElement("p", "review-label", label));
    card.appendChild(createElement("strong", "", value));
    return card;
  }

  function promptSummaryText(question) {
    if (question.modeId === "name-from-symbol-number") {
      return "記号 + " + question.correctItem.number;
    }
    if (question.modeId === "number-from-symbol-name") {
      return question.correctItem.name + " + 記号";
    }
    return question.correctItem.number;
  }

  function renderPromptSummary(question) {
    var wrapper = createElement("div", "review-triad");
    wrapper.appendChild(createTriadItem("Prompt", promptSummaryText(question)));
    wrapper.appendChild(createTriadItem("Number", question.correctItem.number));
    wrapper.appendChild(createTriadItem("Name", question.correctItem.name));
    return wrapper;
  }

  function reviewAnswerText(question) {
    if (!question.selectedKey) {
      return "未回答";
    }

    if (question.answerType === "name") {
      return question.selectedKey.replace(/^name:/, "");
    }

    var matchedOption = question.options.find(function (option) {
      return option.key === question.selectedKey;
    });
    return matchedOption ? optionText(matchedOption) : "未回答";
  }

  function findSelectedOption(question) {
    return question.options.find(function (option) {
      return option.key === question.selectedKey;
    }) || null;
  }

  function correctAnswerText(question) {
    if (question.answerType === "name") {
      return question.correctItem.name;
    }
    if (question.answerType === "number") {
      return question.correctItem.number;
    }
    return question.correctItem.number + " / " + question.correctItem.name;
  }

  function renderAnswerValueCard(label, question, option, fallbackText) {
    var card = createElement("div", "answer-value-card");
    card.appendChild(createElement("p", "review-label", label));

    if (question.answerType === "symbol" && option && option.item) {
      card.appendChild(renderPromptField("symbol", option.item));
      card.appendChild(createElement("p", "review-correct", optionText(option)));
      return card;
    }

    card.appendChild(createElement("strong", "", fallbackText));
    return card;
  }

  function renderReviewCard(question, index) {
    var correct = isCorrectSelection(question);
    var selectedOption = findSelectedOption(question);
    var card = createElement("article", "review-card");
    var top = createElement("div", "review-top");
    top.appendChild(createElement("h3", "", "Q" + (index + 1)));
    top.appendChild(
      createElement("span", "review-badge " + (correct ? "correct" : "incorrect"), correct ? "Correct" : "Incorrect")
    );
    card.appendChild(top);

    var layout = createElement("div", "review-layout");
    var promptColumn = createElement("div", "review-prompt-column");
    promptColumn.appendChild(renderQuestionPrompt(question));
    layout.appendChild(promptColumn);

    var answerColumn = createElement("div", "review-answer-block");
    answerColumn.appendChild(
      renderAnswerValueCard("Your answer", question, selectedOption, reviewAnswerText(question))
    );
    answerColumn.appendChild(
      renderAnswerValueCard(
        "Correct answer",
        question,
        question.answerType === "symbol" ? createItemOption("symbol", question.correctItem) : null,
        correctAnswerText(question)
      )
    );
    answerColumn.appendChild(renderPromptSummary(question));

    var correctSymbol = createElement("div", "prompt-card");
    correctSymbol.appendChild(createElement("p", "panel-label", "Correct symbol"));
    correctSymbol.appendChild(renderPromptField("symbol", question.correctItem));
    answerColumn.appendChild(correctSymbol);
    layout.appendChild(answerColumn);

    card.appendChild(layout);
    return card;
  }

  function renderResultScreen(session) {
    var mode = getMode(session.modeId);
    var screen = createElement("div", "result-screen");
    var summary = createElement("section", "result-summary");
    summary.appendChild(createElement("p", "panel-label", "Result"));
    summary.appendChild(createElement("h2", "", mode.title));
    summary.appendChild(createElement("p", "score-line", session.score + " / " + SESSION_LENGTH));
    summary.appendChild(createElement("p", "", "各問題の正解を見返して、記号・番号・名称の対応を確認できます。"));

    var summaryRow = createElement("div", "summary-row");
    summaryRow.appendChild(createElement("span", "summary-chip", "正解数 " + session.score));
    summaryRow.appendChild(createElement("span", "summary-chip", "不正解 " + (SESSION_LENGTH - session.score)));
    summaryRow.appendChild(createElement("span", "summary-chip", "全 " + SESSION_LENGTH + " 問"));
    summary.appendChild(summaryRow);

    var actions = createElement("div", "result-actions");
    var replay = createElement("button", "secondary-button", "同じモードでもう一度");
    replay.type = "button";
    replay.addEventListener("click", function () {
      state.session = createSession(session.modeId);
      state.selectedOptionKey = null;
      updateSidebar();
      render();
    });
    actions.appendChild(replay);

    var reset = createElement("button", "ghost-button", "モード選択に戻る");
    reset.type = "button";
    reset.addEventListener("click", function () {
      state.session = null;
      state.selectedOptionKey = null;
      updateSidebar();
      render();
    });
    actions.appendChild(reset);
    summary.appendChild(actions);
    screen.appendChild(summary);

    var reviewList = createElement("div", "review-list");
    session.questions.forEach(function (question, index) {
      reviewList.appendChild(renderReviewCard(question, index));
    });
    screen.appendChild(reviewList);

    return screen;
  }

  function renderEmptyState() {
    var empty = createElement("section", "empty-state");
    empty.appendChild(createElement("p", "panel-label", "Ready"));
    empty.appendChild(createElement("h2", "", "モードを選んで10問セッションを開始"));
    empty.appendChild(
      createElement(
        "p",
        "",
        "名称、番号、記号のどれを答えるかを切り替えながら、ISOMの対応関係を反復できます。"
      )
    );
    return empty;
  }

  function render() {
    renderModeSelector();
    updateSidebar();

    var root = document.getElementById("screen-root");
    root.innerHTML = "";

    if (!state.session) {
      root.appendChild(renderEmptyState());
      return;
    }

    if (state.session.completed) {
      root.appendChild(renderResultScreen(state.session));
      return;
    }

    root.appendChild(renderQuizScreen(state.session));
  }

  function startSelectedMode() {
    state.session = createSession(state.selectedModeId);
    state.selectedOptionKey = null;
    updateSidebar();
    render();
  }

  function initApp() {
    var startButton = document.getElementById("start-button");
    startButton.addEventListener("click", function () {
      if (state.session && !state.session.completed) {
        return;
      }
      startSelectedMode();
    });

    updateSidebar();
    render();
  }

  var exported = {
    ASSET_PATHS: ASSET_PATHS,
    ISOM_ITEMS: ISOM_ITEMS,
    MODES: MODES,
    SESSION_LENGTH: SESSION_LENGTH,
    buildDataset: buildDataset,
    parseIsomAssetPath: parseIsomAssetPath,
    createQuestions: createQuestions,
    createSession: createSession,
    isCorrectSelection: isCorrectSelection,
    finalizeSession: finalizeSession
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = exported;
  }

  global.ISOMFlashCard = exported;

  if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", initApp);
  }
})(typeof window !== "undefined" ? window : globalThis);
