using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FadeController : MonoBehaviour {

	[SerializeField]
	GameObject fadeCanvas = null;
    Fade fade = null;


	// Use this for initialization
	void Start () {
		fade = fadeCanvas.GetComponent<Fade>();
	}
	
	// Update is called once per frame
	void Update () {
		
	}

    public void FadeIn(float time) {
        this.fade.FadeIn(time);
    }
    public void FadeOut(float time) {
        this.fade.FadeOut(time);
    }
}
