/// <reference types="cypress" />

import { type, apply, serializedTextarea, blur } from "../helpers";

context("Text", () => {
  const textareaId = "text";

  beforeEach(() => {
    cy.visit("./cypress/resources/editor.html");
    apply({
      id: textareaId,
    });
  });

  it("supported", () => {
    cy.get(
      `.mt-be-shortcut-block-list [data-mt-be-type="sixapart-oembed"]`
    ).click();

    cy.wait(100);
    type("https://www.youtube.com/watch?v=h9yxBcbw0bw\n");

    serializedTextarea(textareaId).should(
      "have.value",
      `<!-- mt-beb t="core-context" m='{"1":{"url":"https://www.youtube.com/watch?v=h9yxBcbw0bw","height":270,"providerName":"YouTube","authorName":"ドクター・キャピタルDr. Capital","title":"スピッツ (Spitz) の チェリー (Cherry) - Dr. Capital","authorUrl":"https://www.youtube.com/user/capitalguitar","width":480,"version":"1.0","thumbnailWidth":480,"providerUrl":"https://www.youtube.com/","thumbnailUrl":"https://i.ytimg.com/vi/h9yxBcbw0bw/hqdefault.jpg","type":"video","thumbnailHeight":360}}' --><!-- /mt-beb --><!-- mt-beb t="sixapart-oembed" m='1' h='' --><iframe width="480" height="270" src="https://www.youtube.com/embed/h9yxBcbw0bw?feature=oembed" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><!-- /mt-beb -->`
    );

    cy.get(`[data-mt-block-editor-block-id]`).click();
    cy.wait(100);
    blur();

    // Metadata must be preserved
    serializedTextarea(textareaId).should(
      "have.value",
      `<!-- mt-beb t="core-context" m='{"1":{"url":"https://www.youtube.com/watch?v=h9yxBcbw0bw","height":270,"providerName":"YouTube","authorName":"ドクター・キャピタルDr. Capital","title":"スピッツ (Spitz) の チェリー (Cherry) - Dr. Capital","authorUrl":"https://www.youtube.com/user/capitalguitar","width":480,"version":"1.0","thumbnailWidth":480,"providerUrl":"https://www.youtube.com/","thumbnailUrl":"https://i.ytimg.com/vi/h9yxBcbw0bw/hqdefault.jpg","type":"video","thumbnailHeight":360}}' --><!-- /mt-beb --><!-- mt-beb t="sixapart-oembed" m='1' h='' --><iframe width="480" height="270" src="https://www.youtube.com/embed/h9yxBcbw0bw?feature=oembed" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><!-- /mt-beb -->`
    );
  });

  it("maxwidth / maxheight", () => {
    cy.get(
      `.mt-be-shortcut-block-list [data-mt-be-type="sixapart-oembed"]`
    ).click();

    cy.wait(100);
    type("https://www.youtube.com/watch?v=h9yxBcbw0bw");
    cy.get(`[data-property-name="maxwidth"]`).click();
    type("600");
    cy.get(`[data-property-name="maxheight"]`).click();
    type("600");

    blur();

    serializedTextarea(textareaId).should(
      "have.value",
      `<!-- mt-beb t="core-context" m='{"1":{"url":"https://www.youtube.com/watch?v=h9yxBcbw0bw","maxwidth":"600","maxheight":"600","height":270,"providerName":"YouTube","authorName":"ドクター・キャピタルDr. Capital","title":"スピッツ (Spitz) の チェリー (Cherry) - Dr. Capital","authorUrl":"https://www.youtube.com/user/capitalguitar","width":480,"version":"1.0","thumbnailWidth":480,"providerUrl":"https://www.youtube.com/","thumbnailUrl":"https://i.ytimg.com/vi/h9yxBcbw0bw/hqdefault.jpg","type":"video","thumbnailHeight":360}}' --><!-- /mt-beb --><!-- mt-beb t="sixapart-oembed" m='1' h='' --><iframe width="480" height="270" src="https://www.youtube.com/embed/h9yxBcbw0bw?feature=oembed" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe><!-- /mt-beb -->`
    );
  });

  it("ogp", () => {
    cy.get(
      `.mt-be-shortcut-block-list [data-mt-be-type="sixapart-oembed"]`
    ).click();

    cy.wait(100);
    type("https://www.sixapart.com/\n");

    serializedTextarea(textareaId).should(
      "have.value",
      `<!-- mt-beb t="core-context" m='{"1":{"url":"https://www.sixapart.com/","ogUrl":"https://www.sixapart.com/","ogTitle":"sixapart","ogImage":"https://www.sixapart.com/sixapart.png"}}' --><!-- /mt-beb --><!-- mt-beb t="sixapart-oembed" m='1' h='' --><a href="https://www.sixapart.com/">sixapart</a><span>resolved: 0</span><!-- /mt-beb -->`
    );

    cy.get(`[data-mt-block-editor-block-id]`).click();
    cy.wait(100);
    blur();

    // Metadata must be preserved
    serializedTextarea(textareaId).should(
      "have.value",
      `<!-- mt-beb t="core-context" m='{"1":{"url":"https://www.sixapart.com/","ogUrl":"https://www.sixapart.com/","ogTitle":"sixapart","ogImage":"https://www.sixapart.com/sixapart.png"}}' --><!-- /mt-beb --><!-- mt-beb t="sixapart-oembed" m='1' h='' --><a href="https://www.sixapart.com/">sixapart</a><span>resolved: 0</span><!-- /mt-beb -->`
    );

    cy.get(`[data-mt-block-editor-block-id]`).click();
    cy.wait(100);
    cy.get(`[data-property-name="url"]`).clear();
    type("https://www.sixapart.com/index.html\n");

    serializedTextarea(textareaId).should(
      "have.value",
      `<!-- mt-beb t="core-context" m='{"1":{"url":"https://www.sixapart.com/index.html","ogUrl":"https://www.sixapart.com/","ogTitle":"sixapart","ogImage":"https://www.sixapart.com/sixapart.png"}}' --><!-- /mt-beb --><!-- mt-beb t="sixapart-oembed" m='1' h='' --><a href="https://www.sixapart.com/">sixapart</a><span>resolved: 1</span><!-- /mt-beb -->`
    );
  });

  it("unsupported", () => {
    cy.get(
      `.mt-be-shortcut-block-list [data-mt-be-type="sixapart-oembed"]`
    ).click();

    cy.wait(100);
    type("https://www.example.com/watch?v=h9yxBcbw0bw\n");

    serializedTextarea(textareaId).should(
      "have.value",
      `<!-- mt-beb t="core-context" m='{"1":{"url":"https://www.example.com/watch?v=h9yxBcbw0bw"}}' --><!-- /mt-beb --><!-- mt-beb t="sixapart-oembed" m='1' h='' -->埋め込み用のHTMLを取得することができませんでした: https://www.example.com/watch?v=h9yxBcbw0bw<!-- /mt-beb -->`
    );
  });
});
