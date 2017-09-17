using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class VREyeContorller : MonoBehaviour {

	public GameObject bullet;

	public GameObject target;
	public AudioClip se_shot;
	private AudioSource audioSource;

	// Use this for initialization
	void Start () {
		this.target = null;
		this.audioSource = this.gameObject.GetComponent<AudioSource>();
	}
	
	// Update is called once per frame
	void Update () {
		if (Input.GetMouseButtonDown (0)) {
			//発射音再生
			this.audioSource.PlayOneShot(this.se_shot);

			//ショット投入
			GameObject blt1 = Instantiate(bullet, Vector3.zero, Quaternion.identity);
			GameObject blt2 = Instantiate(bullet, Vector3.zero, Quaternion.identity);
			Quaternion rot = Camera.main.transform.rotation;
			blt1.transform.rotation = rot;
			blt2.transform.rotation = rot;
			blt1.transform.Translate(1, 0, 0);
			blt2.transform.Translate(-1, 0, 0);
			if (this.target) {
				//インサイトの場合はターゲットの方向を向く
				blt1.transform.LookAt(this.target.gameObject.transform);
				blt1.transform.LookAt(this.target.gameObject.transform);
			} else {
			}
		}
	}
}
