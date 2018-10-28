/**
 * Created by admin on 9/4/18.
 */

var PlayerData = cc.Class.extend({
    ctor: function()
    {
        this.chair = -1;
        this.rawInfo = null;
    }
})

var Player = cc.Node.extend({
    ctor: function(panel,gameScene)
    {
        this._super();
        this.panel = panel;
        this.gameScene = gameScene;
        this.playerData = new PlayerData();
        this.panel.addNode(this);
        this.index = -1;


        var node = this.panel.getChildByName("node");
        if(!node)
            return;

        this.node = node;

        this.de_sung = node.getChildByName("de_sung");
        this.gun = this.de_sung.getChildByName("nong_sung");
        this.gun.origin_pos = this.gun.getPosition();
        this.duoi_sung = this.de_sung.getChildByName("duoi_sung");
        this.duoi_sung.origin_pos = this.duoi_sung.getPosition();
        this.fire_node = this.de_sung.getChildByName("fire");


        var bg_thongtin = this.panel.getChildByName("bg_thongtin");
        // player info label
        this.lbName = bg_thongtin.getChildByName("username");
        this.lbMoney1 = bg_thongtin.getChildByName("lbMoney");
        this.lbMoney2 = bg_thongtin.getChildByName("lbMoney2");
        this.gunMoney = node.getChildByName("money");

    },
    getChair: function()
    {
        return this.playerData.chair;
    },
    setChair: function(chair)
    {
        this.playerData.chair = chair;
    },
    setAngleForGun: function(screenPos)
    {
        var node_pos = screenPos;
        var gun_pos = this.fire_node.convertToWorldSpaceAR(cc.p(0,0));

        var vel = vec2(node_pos.x - gun_pos.x,node_pos.y - gun_pos.y);
        var angle = Math.RotationFromVel(vel);

        if(this.index >= 2)
            angle += 180;

        this.de_sung.setRotation(angle);

    },
    effectShoot: function()
    {
        this.gun.stopAllActions();
        this.duoi_sung.stopAllActions();

        this.duoi_sung.setPosition(this.duoi_sung.origin_pos);
        this.duoi_sung.runAction(cc.sequence(cc.moveBy(0.05,0,-5),cc.moveBy(0.05,0,5)))

        this.gun.setScale(1);
        this.gun.runAction(cc.sequence(cc.scaleTo(0.05,1,0.3),cc.scaleTo(0.05,1,1)));
    },
    enable: function(bool)
    {
        this.panel.setVisible(bool);
    },
    updateInfo: function()
    {
        this.lbName.setString(this.playerData.rawData["displayName"]);
        this.lbMoney1.setString(this.playerData.rawData["balance"]);
        this.lbMoney2.setString(this.playerData.rawData["balance"]);
    }


})