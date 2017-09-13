using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerBulletConttroller : MonoBehaviour {
	//弾速
	float speed = 2;

	// Use this for initialization
	void Start () {
		Quaternion rot = Camera.main.transform.rotation;
		this.transform.rotation = rot;
		Destroy(this.gameObject, 5);
	}
	
	// Update is called once per frame
	void Update () {
        this.transform.Translate(0, 0, this.speed);
	}
}
