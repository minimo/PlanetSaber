﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerBulletConttroller : MonoBehaviour {
	//弾速
	float speed = 2;

	// Use this for initialization
	void Start () {
		Destroy(this.gameObject, 3);
	}
	
	// Update is called once per frame
	void Update () {
        this.transform.Translate(0, 0, this.speed);
	}
}
