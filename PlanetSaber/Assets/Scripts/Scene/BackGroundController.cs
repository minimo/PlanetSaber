﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BackGroundController : MonoBehaviour {

	public int tweenTime = 100;
	public string PathName = "Path1";

	// Use this for initialization
	void Start () {
		iTween.MoveTo(this.gameObject, iTween.Hash(
			"path", iTweenPath.GetPath (PathName),
			"time", tweenTime,
			"easeType", iTween.EaseType.linear,
			"orienttopath", false));
	}
	
	// Update is called once per frame
	void Update () {
		
	}
}
