using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerBulletConttroller : MonoBehaviour {
	//弾速
	float speed = 2;

	// Use this for initialization
	void Start () {
		Quaternion rot = Camera.main.transform.rotation;
		Vector3 pos = Camera.main.transform.position;
		pos.y += 2.0f;
		this.transform.rotation = rot;
		this.transform.position = pos;
		Destroy(this.gameObject, 3);
	}
	
	// Update is called once per frame
	void Update () {
        this.transform.Translate(0, 0, this.speed);
	}
}
