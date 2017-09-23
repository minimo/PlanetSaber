using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EnemyBasic : MonoBehaviour {

	//敵情報
    public int shield = 10;	//耐久力
    public bool isRemove = true;
    private bool isDead = false;

	//プレイヤー情報
    private GameObject player;
    private VREyeContorller script;

    //爆発オブジェクト
    public GameObject explode;
    public float explodeScale = 1.0f;

    //爆発効果音
    private AudioSource audioSource;
    public AudioClip se_explode;

    // Use this for initialization
    void Start () {
        this.player = GameObject.FindWithTag("Player");
        this.script = this.player.GetComponent<VREyeContorller>();
      this.audioSource = this.gameObject.GetComponent<AudioSource>();
    }
	
    // Update is called once per frame
    void Update () {
    }

    public void inSight(){
        script.target = this.gameObject;
    }

    public void outSight(){
        script.target = null;
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

        if (this.isRemove) Destroy(this.gameObject);
        this.isDead = true;

        //爆発オブジェクト投入
        GameObject exp = Instantiate(
            explode,
            new Vector3(transform.position.x, transform.position.y, transform.position.z),
            Quaternion.identity);
        exp.transform.localScale.Set(this.explodeScale, this.explodeScale, this.explodeScale);
    }
}
