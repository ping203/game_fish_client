/**
 * Created by phuongtv on 6/21/2017.
 */
var GLSLTest = cc.Layer.extend({
    _subtitle:"",
    _cylinder_texture_offset:0,
    _shining_duraion:0,
    _state:null,
    fade_in:true,
    cylinder:null,
    _cylinder_texture_offset:0,
    ctor:function () {
        this._super();

        var visibleSize = cc.director.getVisibleSize();
        var camera = new cc.Camera(cc.Camera.Mode.PERSPECTIVE, 60, visibleSize.width/visibleSize.height, 0.1, 1000);
        camera.setCameraFlag(cc.CameraFlag.USER1);
        this.addChild(camera);
        this.setCameraMask(2);
        camera.setPosition3D(cc.math.vec3(0, 0, 500));

        this.cylinder = new jsb.Sprite3D("res/bianfuyu.c3b");
        this.addChild(this.cylinder);
        this.cylinder.setRotation3D(cc.math.vec3(0, 0, -30));
        this.cylinder.setScale(2);
        // cylinder.setPosition(visibleSize.width/2, visibleSize.height/2);
        this.cylinder.setCameraMask(2);


        var animation = new jsb.Animation3D("res/bianfuyu.c3b");
        if(animation){
            var animate = new jsb.Animate3D(animation);
            animate.setSpeed(1);
            this.cylinder.runAction(new cc.RepeatForever(animate));
        }

        // this.schedule(this.onScheduleFuc,0.1);

        // var shader = new cc.GLProgram("res/GLSLTest.vert","res/GLSLTest.frag");
        // this._state = cc.GLProgramState.create(shader);
        // cylinder.setGLProgramState(this._state);

        // var shining_texture = cc.textureCache.addImage("res/caustics.png");
        // shining_texture.setTexParameters(gl.NEAREST, gl.NEAREST, gl.REPEAT, gl.REPEAT);
        //this._state.setUniformTexture("u_sampler1", shining_texture);
        this.scheduleUpdate();

        var mat = cc.Material.createWithFilename("res/GLSLTest.material");
        mat.setTechnique("demo_skinned");
        this._state = mat.getTechniqueByIndex(0).getPassByIndex(0).getGLProgramState();
        this.cylinder.setMaterial(mat);
        this._state.setUniformFloat("offset", this._cylinder_texture_offset);

        // _state.setUniformVec3("u_ambientColor", cc.math.vec3(255, 255, 255));
        // _state.setUniformVec2("v_texCoord", cc.p(100, 100));
        // _state.setUniformFloat("border",  0.01);
        // _state.setUniformFloat("circle_radius",  0.5);

        // mProgramExample = new  cc.GLProgram();
        // mProgramExample.initWithFilenames("res/normal.vert", "res/normal.frag");
        // mProgramExample.bindAttribLocation(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
        // mProgramExample.bindAttribLocation(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
        // mProgramExample.bindAttribLocation(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
        // mProgramExample.link();
        // mProgramExample.updateUniforms();

        var offset = 0;
        var attributeCount = this.cylinder.getMesh().getMeshVertexAttribCount();
        for(var i = 0; i < attributeCount; ++i){
            var meshattribute = this.cylinder.getMesh().getMeshVertexAttribute(i);
                this._state.setVertexAttribPointer(cc.attributeNames[meshattribute.vertexAttrib],
                meshattribute.size,
                meshattribute.type,
                gl.FALSE,
                    this.cylinder.getMesh().getVertexSizeInBytes(),
                offset);
            offset += meshattribute.attribSizeBytes;
        }

        // var light = new jsb.PointLight(cc.math.vec3(35, 75, -20.5), cc.color(255, 255, 255), 150);
        // var light = new jsb.PointLight(cc.math.vec3(0, 400, 700), cc.color(255, 255, 255), 1500);
        // this.addChild(light);
        // var ambient = new jsb.AmbientLight(cc.color(55, 55, 55));
        // this.addChild(ambient);
        // ambient.setPosition3D(cc.math.vec3(0, 400, 700));
        // var spotLight = new jsb.SpotLight(cc.color(255, 255, 255));
        // this.addChild(spotLight);
        // var shader = new cc.GLProgram("res/GLSLTest.vert","res/GLSLTest.frag");
        // var _state = cc.GLProgramState.create(shader);
        // cylinder.setGLProgramState(_state);
        // var shining_texture = cc.textureCache.addImage("res/caustics.png");
        // shining_texture.setTexParameters(gl.NEAREST, gl.NEAREST, gl.REPEAT, gl.REPEAT);
        // _state.setUniformTexture("u_sampler1", shining_texture);
        //
        // var shader = new cc.GLProgram("res/demoClass1.vert","res/demoClass1.frag");
        // var state = cc.GLProgramState.create(shader);
        // cylinder.setGLProgramState(state);

    },

    update:function(dt){
        this._cylinder_texture_offset += 0.3 * dt;
        this._cylinder_texture_offset = this._cylinder_texture_offset > 1 ? 0 : this._cylinder_texture_offset;
        this._state.setUniformFloat("offset", this._cylinder_texture_offset);
    },
    onScheduleFuc:function () {
        var r = this.cylinder.getRotation3D();
        this.cylinder.setRotation3D(cc.math.vec3(r.x, r.y+5, r.x));
    },
    
    showlogOBj:function (obj) {
        console.log("***********************************");
        for(var key in obj)
        {
            console.log(key );
        }
        console.log("***********************************");
    }
});

