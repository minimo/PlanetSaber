using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BattleShipController : MonoBehaviour {

    //艦船等級(A-E)
    public string shipClass;

	//敵情報
    public int shield = 10;	//耐久力
    private bool isDead = false;

	//プレイヤー情報
    private GameObject player;
    private VREyeContorller script;

    //経過フレーム時間
    int time = 0;

    // Use this for initialization
    void Start () {
        this.player = GameObject.FindWithTag("Player");
        this.script = this.player.GetComponent<VREyeContorller>();
    }
	
    // Update is called once per frame
    void Update () {
        if (this.isDead) {
        }
    }

    void OnTriggerEnter(Collider other) {
        string name = other.gameObject.name;
        if (name.Contains("PlayerBullet")) {
            this.damage(other.gameObject);
        }
    }

    public void damage(GameObject obj) {
        this.shield -= 10;
        if (!this.isDead && this.shield <= 0) {
            this.dead();
        } else {
        	PlayerBulletController pc = obj.GetComponent<PlayerBulletController>();
            pc.impact();
        }
    }

    void dead() {
        //効果音再生
//      this.audioSource.Play();

        //死亡フラグ
        this.isDead = true;
/*
        //爆発オブジェクト投入
        GameObject exp = Instantiate(
            explode,
            new Vector3(transform.position.x, transform.position.y, transform.position.z),
            Quaternion.identity);
        exp.transform.localScale.Set(this.explodeScale, this.explodeScale, this.explodeScale);
*/
    }
}
