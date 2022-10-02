import { ExtendedSuggestionResult } from './suggestion-result';

describe('ExtendedSuggestionResult', () => {
  it('calculates selection correctly', () => {
    let testCase: ExtendedSuggestionResult;

    testCase = new ExtendedSuggestionResult({text: 'abc', remaining: ''}, 'abc', 0);
    expect(testCase.selectionStart).toEqual(0);
    expect(testCase.selectionEnd).toEqual(3);

    testCase = new ExtendedSuggestionResult({text: 'abc', remaining: 'def'}, 'abddef', 0);
    expect(testCase.selectionStart).toEqual(0);
    expect(testCase.selectionEnd).toEqual(3);

    testCase = new ExtendedSuggestionResult({text: 'def', remaining: ''}, 'def', 3);
    expect(testCase.selectionStart).toEqual(3);
    expect(testCase.selectionEnd).toEqual(6);

    testCase = new ExtendedSuggestionResult({text: 'def', remaining: 'ghi'}, 'defghi', 3);
    expect(testCase.selectionStart).toEqual(3);
    expect(testCase.selectionEnd).toEqual(6);

    testCase = new ExtendedSuggestionResult({text: 'abc', remaining: 'def'}, 'abdef', 0);
    expect(testCase.selectionStart).toEqual(0);
    expect(testCase.selectionEnd).toEqual(2);

    testCase = new ExtendedSuggestionResult({text: 'abc', remaining: 'def'}, 'abcddef', 0);
    expect(testCase.selectionStart).toEqual(0);
    expect(testCase.selectionEnd).toEqual(4);
  });

  it('replaces textarea value correctly', () => {
    let testCase: ExtendedSuggestionResult;
    let $textarea: HTMLTextAreaElement;

    $textarea = document.createElement('textarea');
    $textarea.value = 'abd';
    testCase = new ExtendedSuggestionResult({text: 'abc', remaining: ''}, 'abd', 0);
    testCase.apply($textarea);
    expect($textarea.value).toEqual('abc');
    expect($textarea.selectionStart).toEqual(3);
    expect($textarea.selectionEnd).toEqual(3);

    $textarea = document.createElement('textarea');
    $textarea.value = 'abcdeh';
    testCase = new ExtendedSuggestionResult({text: 'def', remaining: ''}, 'deh', 3);
    testCase.apply($textarea);
    expect($textarea.value).toEqual('abcdef');
    expect($textarea.selectionStart).toEqual(6);
    expect($textarea.selectionEnd).toEqual(6);

    $textarea = document.createElement('textarea');
    $textarea.value = 'abdef ghi';
    testCase = new ExtendedSuggestionResult({text: 'abc', remaining: 'def'}, 'abdef', 0);
    testCase.apply($textarea);
    expect($textarea.value).toEqual('abcdef ghi');
    expect($textarea.selectionStart).toEqual(3);
    expect($textarea.selectionEnd).toEqual(3);

    $textarea = document.createElement('textarea');
    $textarea.value = 'abcdef gxijkl';
    testCase = new ExtendedSuggestionResult({text: 'ghi', remaining: 'jkl'}, 'gxijkl', 7);
    testCase.apply($textarea);
    expect($textarea.value).toEqual('abcdef ghijkl');
    expect($textarea.selectionStart).toEqual(10);
    expect($textarea.selectionEnd).toEqual(10);
  });
});
