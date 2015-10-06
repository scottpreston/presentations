package com.scottsbots.jarvis.sr;

import com.scottsbots.jarvis.utils.ApacheHttp;
import com.scottsbots.jarvis.utils.JarvisUtils;
import edu.cmu.sphinx.frontend.util.Microphone;
import edu.cmu.sphinx.recognizer.Recognizer;
import edu.cmu.sphinx.result.Result;
import edu.cmu.sphinx.util.props.ConfigurationManager;

public class BasicRecognizer2 {

    public void listen() {
        ConfigurationManager cm;
        cm = new ConfigurationManager(Hello.class.getResource("hello.config.xml"));
        //cm = new ConfigurationManager(Hello.class.getResource("dynamic.config.xml"));

        Recognizer recognizer = (Recognizer) cm.lookup("recognizer");
        recognizer.allocate();

        // start the microphone or exit if the programm if this is not possible
        Microphone microphone = (Microphone) cm.lookup("microphone");
        if (!microphone.startRecording()) {
            JarvisUtils.logger("Cannot start microphone.");
            recognizer.deallocate();
            System.exit(1);
        }

        JarvisUtils.logger("I'm listening...");

        // loop the recognition until the programm exits.
        while (true) {
            Result result = recognizer.recognize();
            if (result != null) {
                String resultText = result.getBestFinalResultNoFiller();
                JarvisUtils.logger("I heard: " + resultText);
                String recognizerURL = "http://192.168.1.60/voice/respond/";
                ApacheHttp.postSingleString(recognizerURL,"txt",resultText);
                JarvisUtils.pause(2000); // wait a second before listening again
            }
        }
    }

    public static void main(String[] args) {
        BasicRecognizer2 basic2 = new BasicRecognizer2();
        basic2.listen();
    }

}
