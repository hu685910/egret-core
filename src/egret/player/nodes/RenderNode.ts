//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

namespace egret.sys {
    /**
     * @private
     * 渲染节点类型
     */
    export const enum RenderNodeType {
        /**
         * 位图渲染节点
         */
        BitmapNode = 1,
        /**
         * 文本渲染节点
         */
        TextNode,
        /**
         * 矢量渲染节点
         */
        GraphicsNode,
        /**
         * 组渲染节点
         */
        GroupNode,
        /**
         * Mesh 节点
         */
        MeshNode,
        /**
         * 普通位图渲染节点
         */
        NormalBitmapNode
    }

    /**
     * @private
     * 渲染节点基类
     */
    export class RenderNode {

        constructor () {
            this.resizeTextureTransformGroup(1);
        }

        /**
         * 节点类型..
         */
        public type:number = 0;
        /**
         * 绘制数据
         */
        public drawData:any[] = [];
        /**
         * 绘制次数
         */
        protected renderCount:number = 0;

        //
        public batchSystem: sys.RenderBatchSystem;

        /**
         * 在显示对象的$updateRenderNode()方法被调用前，自动清空自身的drawData数据。
         */
        public cleanBeforeRender():void{
            this.drawData.length = 0;
            this.renderCount = 0;
        }

        public $getRenderCount():number {
            return this.renderCount;
        }

        //现在这个是个中间件，后续可以通过重构手段移除，直接达成worldtransform => x, y, u, v, tint, 现在需要worldtransform => some texturetransforms => x, y, u, v, tint
        private readonly _textureTransformGroup: Transform[] = [];
        private _textureTransformIndex: number = 0;
        /**
         * 定位一个textureTransform
         * @param index 定位下标
         */
        public textureTransformIndex(index: number): void {
            this._textureTransformIndex = index;
        }
        /**
         * 获取当前定位的textureTransform
         */
        public get textureTransform(): Transform {
            return this._textureTransformGroup[this._textureTransformIndex];
        }
        /**
         * 改变_textureTransformGroup长度，可以清零
         * @param newLength 新的长度
         */
        public resizeTextureTransformGroup(newLength: number): void {
            if (newLength === 0) {
                this._textureTransformGroup.length = 0;
                return;
            }
            const _textureTransformGroup = this._textureTransformGroup;
            const oldLength = _textureTransformGroup.length;
            _textureTransformGroup.length = newLength;
            for (let i = oldLength; i < newLength; ++i) {
                if (!_textureTransformGroup[i]) {
                    _textureTransformGroup[i] = new Transform;
                }
            }
        }
    }
}