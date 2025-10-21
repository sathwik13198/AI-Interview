import React from 'react';
import { Problem, Difficulty, Test } from './types';

export const MOCK_PROBLEM: Problem = {
  id: 'two-sum',
  title: 'Two Sum',
  prompt: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
  examples: [
    {
      in: 'nums = [2,7,11,15], target = 9',
      out: '[0,1]',
      explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
    },
    {
      in: 'nums = [3,2,4], target = 6',
      out: '[1,2]',
    },
    {
      in: 'nums = [3,3], target = 6',
      out: '[0,1]',
    },
  ],
  constraints: [
    '`2 <= nums.length <= 10^4`',
    '`-10^9 <= nums[i] <= 10^9`',
    '`-10^9 <= target <= 10^9`',
    '**Only one valid answer exists.**',
  ],
  difficulty: Difficulty.EASY,
  initialCode: {
    javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    
};`,
    python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        `,
    java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        
    }
}`,
    cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        
    }
};`,
  },
  testCases: [
    { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
    { input: [[3, 2, 4], 6], expected: [1, 2] },
    { input: [[3, 3], 6], expected: [0, 1] },
    { input: [[-1, -2, -3, -4, -5], -8], expected: [2, 4] },
  ]
};

export const MOCK_PROBLEM_2: Problem = {
  id: 'valid-parentheses',
  title: 'Valid Parentheses',
  prompt: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
  examples: [
    { in: 's = "()"', out: 'true' },
    { in: 's = "()[]{}"', out: 'true' },
    { in: 's = "(]"', out: 'false' },
  ],
  constraints: [
    '`1 <= s.length <= 10^4`',
    '`s` consists of parentheses only \'()[]{}\'.',
  ],
  difficulty: Difficulty.EASY,
  initialCode: {
    javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
    
};`,
    python: `class Solution:
    def isValid(self, s: str) -> bool:
        `,
    java: `class Solution {
    public boolean isValid(String s) {
        
    }
}`,
    cpp: `class Solution {
public:
    bool isValid(string s) {
        
    }
};`,
  },
  testCases: [
    { input: ['()'], expected: true },
    { input: ['()[]{}'], expected: true },
    { input: ['(]'], expected: false },
    { input: ['([)]'], expected: false },
    { input: ['{[]}'], expected: true },
  ]
};

export const MOCK_PROBLEM_3: Problem = {
  id: 'longest-substring',
  title: 'Longest Substring Without Repeating Characters',
  prompt: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
  examples: [
    { in: 's = "abcabcbb"', out: '3', explanation: 'The answer is "abc", with the length of 3.' },
    { in: 's = "bbbbb"', out: '1', explanation: 'The answer is "b", with the length of 1.' },
    { in: 's = "pwwkew"', out: '3', explanation: 'The answer is "wke", with the length of 3. Notice that the answer must be a substring, "pwke" is a subsequence and not a substring.' },
  ],
  constraints: [
    '`0 <= s.length <= 5 * 10^4`',
    '`s` consists of English letters, digits, symbols and spaces.',
  ],
  difficulty: Difficulty.MEDIUM,
  initialCode: {
    javascript: `/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
    
};`,
    python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        `,
  },
  testCases: [
    { input: ['abcabcbb'], expected: 3 },
    { input: ['bbbbb'], expected: 1 },
    { input: ['pwwkew'], expected: 3 },
    { input: [''], expected: 0 },
    { input: [' '], expected: 1 },
    { input: ['au'], expected: 2 },
    { input: ['dvdf'], expected: 3 },
  ]
};

export const MOCK_PROBLEM_4: Problem = {
  id: 'median-sorted-arrays',
  title: 'Median of Two Sorted Arrays',
  prompt: `Given two sorted arrays \`nums1\` and \`nums2\` of size \`m\` and \`n\` respectively, return **the median** of the two sorted arrays.

The overall run time complexity should be \`O(log (m+n))\`.`,
  examples: [
    { in: 'nums1 = [1,3], nums2 = [2]', out: '2.00000' },
    { in: 'nums1 = [1,2], nums2 = [3,4]', out: '2.50000' },
  ],
  constraints: [
    '`nums1.length == m`',
    '`nums2.length == n`',
    '`0 <= m <= 1000`',
    '`0 <= n <= 1000`',
    '`1 <= m + n <= 2000`',
    '`-10^6 <= nums1[i], nums2[i] <= 10^6`',
  ],
  difficulty: Difficulty.HARD,
  initialCode: {
    javascript: `/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function(nums1, nums2) {
    
};`,
  },
  testCases: [
    { input: [[1, 3], [2]], expected: 2 },
    { input: [[1, 2], [3, 4]], expected: 2.5 },
    { input: [[0, 0], [0, 0]], expected: 0 },
    { input: [[], [1]], expected: 1 },
    { input: [[2], []], expected: 2 },
  ]
};

export const ALL_MOCK_PROBLEMS = [MOCK_PROBLEM, MOCK_PROBLEM_2, MOCK_PROBLEM_3, MOCK_PROBLEM_4];

export const MOCK_RECRUITER_TESTS: Test[] = [
  {
    id: 'rec-test-1',
    title: 'Frontend Developer Screening - Acme Corp',
    description: 'A standard screening test for mid-level frontend developers focusing on core logic and data structures.',
    timeLimit: 45,
    allowedLanguages: ['javascript', 'python'],
    problemIds: ['two-sum'],
  },
  {
    id: 'rec-test-2',
    title: 'Software Engineer Intern - Stark Industries',
    description: 'A test for our upcoming internship program. Assesses fundamental problem solving skills.',
    timeLimit: 60,
    allowedLanguages: ['javascript', 'python', 'java', 'cpp'],
    problemIds: ['valid-parentheses'],
  }
];

export const MOCK_PRACTICE_TESTS: Test[] = [
  {
    id: 'prac-test-1',
    title: 'Easy Algorithm Practice',
    description: 'Sharpen your skills with some fundamental algorithm challenges.',
    timeLimit: 90,
    allowedLanguages: ['javascript', 'python', 'java', 'cpp'],
    problemIds: ['two-sum', 'valid-parentheses'], // In a real app, a practice session might have multiple questions. For this MVP, we'll only use the first.
  },
   {
    id: 'prac-test-2',
    title: 'Medium Challenge',
    description: 'Test your problem-solving abilities with a medium-difficulty question.',
    timeLimit: 45,
    allowedLanguages: ['javascript', 'python'],
    problemIds: ['longest-substring'],
  },
  {
    id: 'prac-test-3',
    title: 'Advanced Algorithm Challenge',
    description: 'Tackle a difficult problem to prepare for competitive interviews.',
    timeLimit: 60,
    allowedLanguages: ['javascript'],
    problemIds: ['median-sorted-arrays'],
  }
];

export const Icons = {
    Spinner: () => (
      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    ),
    Chat: () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
    ),
    User: () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    ),
    Mic: () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
    ),
    MicOn: () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85l-.02.15v2c0 2.76-2.24 5-5 5s-5-2.24-5-5v-2c0-.55-.45-1-1-1s-1 .45-1 1v2c0 3.53 2.61 6.43 6 6.92V21h-2c-.55 0-1 .45-1 1s.45 1 1 1h6c.55 0 1-.45 1-1s-.45-1-1-1h-2v-2.08c3.39-.49 6-3.39 6-6.92v-2c0-.55-.45-1-1-1z" />
        </svg>
    ),
    Send: () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
        </svg>
    )
};

export const FullPageSpinner: React.FC<{ message?: string }> = ({ message = "Loading..." }) => (
    <div className="absolute inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
        <div className="flex flex-col items-center">
            <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-xl text-white">{message}</p>
        </div>
    </div>
);

export const SkeletonLoader: React.FC = () => (
    <div className="animate-pulse space-y-6 p-4">
        <div className="h-8 bg-gray-700 rounded w-3/4"></div>
        <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        </div>
        <div className="h-8 bg-gray-700 rounded w-1/2 mt-8"></div>
        <div className="space-y-4">
            <div className="h-10 bg-gray-700 rounded"></div>
            <div className="h-10 bg-gray-700 rounded"></div>
            <div className="h-10 bg-gray-700 rounded"></div>
        </div>
         <div className="flex justify-start mt-8">
            <div className="h-10 bg-gray-700 rounded w-32"></div>
        </div>
    </div>
);
