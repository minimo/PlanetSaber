using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EnemyBasic : MonoBehaviour {
	//プレイヤー情報
	private GameObject player;
	private VREyeContorller script;

	//爆発オブジェクト
	public GameObject explode;

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
		this.transform.Translate(0, 0, -0.1f);

		if (this.transform.position.z > 200.0f) {
			Destroy(this.gameObject);
		}
	}

	public void inSight(){
		script.target = this.gameObject;
	}

	public void outSight(){
		script.target = null;
	}

	void OnTriggerEnter(Collider other) {
		this.damage();
	}

	public void damage() {
		//効果音再生
		this.audioSource.PlayOneShot(this.se_explode);
		Destroy(this.gameObject);

		//爆発オブジェクト投入
        Instantiate(
			explode,
			new Vector3(transform.position.x, transform.position.y, transform.position.z),
			Quaternion.identity);
	}
}
