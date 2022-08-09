import{_ as n,o as a,c as s,a as e}from"./app.00e82ae7.js";const p={},t=e(`<h1 id="\u8FD0\u7B97" tabindex="-1"><a class="header-anchor" href="#\u8FD0\u7B97" aria-hidden="true">#</a> \u8FD0\u7B97</h1><h2 id="\u52A0\u500D" tabindex="-1"><a class="header-anchor" href="#\u52A0\u500D" aria-hidden="true">#</a> \u52A0\u500D</h2><p>\u5DE6\u79FB\u4E00\u4F4D\u76F8\u5F53\u4E8E\u4E582</p><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token keyword">int</span> a <span class="token operator">=</span> <span class="token number">12</span><span class="token punctuation">;</span>
b <span class="token operator">=</span> a <span class="token operator">&lt;&lt;</span> <span class="token number">1</span><span class="token punctuation">;</span>
<span class="token comment">// b = 12 * 2</span>
<span class="token comment">// b = 24</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="\u51CF\u534A" tabindex="-1"><a class="header-anchor" href="#\u51CF\u534A" aria-hidden="true">#</a> \u51CF\u534A</h2><p>\u53F3\u79FB\u4E00\u4F4D\u76F8\u5F53\u4E8E\u9664\u4EE52</p><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token keyword">int</span> a <span class="token operator">=</span> <span class="token number">9</span><span class="token punctuation">;</span>
b <span class="token operator">=</span> a <span class="token operator">&gt;&gt;</span> <span class="token number">1</span><span class="token punctuation">;</span>
<span class="token comment">// b = 9 / 2</span>
<span class="token comment">// b = 4</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="\u5224\u65AD\u5947\u5076" tabindex="-1"><a class="header-anchor" href="#\u5224\u65AD\u5947\u5076" aria-hidden="true">#</a> \u5224\u65AD\u5947\u5076</h2><p>\u4E8C\u8FDB\u5236\u6700\u540E\u4E00\u4F4D\u4E3A1\u5219\u4E3A\u5947\u6570</p><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">isEven</span><span class="token punctuation">(</span><span class="token keyword">long</span> a<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token punctuation">(</span>a <span class="token operator">&amp;</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="\u4EA4\u6362\u53D8\u91CF" tabindex="-1"><a class="header-anchor" href="#\u4EA4\u6362\u53D8\u91CF" aria-hidden="true">#</a> \u4EA4\u6362\u53D8\u91CF</h2><p>\u5F02\u6216\u64CD\u4F5C\u6709\u4E24\u4E2A\u6CD5\u5219:</p><ul><li>\u5F02\u6216\u81EA\u8EAB\u7B49\u4E8E0</li><li>\u5F02\u62160\u7B49\u4E8E\u81EA\u8EAB</li></ul><div class="language-java ext-java line-numbers-mode"><pre class="language-java"><code><span class="token keyword">int</span> a <span class="token operator">=</span> <span class="token number">12</span><span class="token punctuation">;</span>
<span class="token keyword">int</span> b <span class="token operator">=</span> <span class="token number">9</span><span class="token punctuation">;</span>

a <span class="token operator">^=</span> b<span class="token punctuation">;</span>
b <span class="token operator">^=</span> a<span class="token punctuation">;</span>
a <span class="token operator">^=</span> b<span class="token punctuation">;</span>

<span class="token comment">// a = (12 ^ 9)</span>
a <span class="token operator">=</span> a <span class="token operator">^</span> b<span class="token punctuation">;</span>
<span class="token comment">// b = (12 ^ 9) ^ 9</span>
<span class="token comment">// b = 12 ^ 9 ^ 9</span>
<span class="token comment">// b = 12</span>
b <span class="token operator">=</span> <span class="token punctuation">(</span>a <span class="token operator">^</span> b<span class="token punctuation">)</span> <span class="token operator">^</span> b
<span class="token comment">// a = (12 ^ 9) ^ 12</span>
<span class="token comment">// a = 12 ^ 12 ^ 9</span>
<span class="token comment">// a = 9</span>
a <span class="token operator">=</span> <span class="token punctuation">(</span>a <span class="token operator">^</span> b<span class="token punctuation">)</span> <span class="token operator">^</span> a
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,14),o=[t];function l(c,i){return a(),s("div",null,o)}var d=n(p,[["render",l],["__file","calculate.html.vue"]]);export{d as default};
